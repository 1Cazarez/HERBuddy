import Foundation
#if canImport(Glibc)
import Glibc
#elseif canImport(Darwin)
import Darwin
#endif

struct SimpleHTTPServer {
    let port: UInt16
    let documentRoot: String
    private let socketFD: Int32

    init(port: UInt16, documentRoot: String) throws {
        self.port = port
        self.documentRoot = documentRoot

        signal(SIGPIPE, SIG_IGN)

        socketFD = socket(AF_INET, Int32(SOCK_STREAM.rawValue), 0)
        guard socketFD >= 0 else {
            throw ServerError.socketCreationFailed
        }

        var reuseAddress: Int32 = 1
        setsockopt(socketFD, SOL_SOCKET, SO_REUSEADDR, &reuseAddress, socklen_t(MemoryLayout<Int32>.size))

        var address = sockaddr_in()
        address.sin_family = sa_family_t(AF_INET)
        address.sin_port = UInt16(port).bigEndian
        address.sin_addr = in_addr(s_addr: in_addr_t(INADDR_ANY))

        let bindResult = withUnsafePointer(to: &address) { pointer in
            pointer.withMemoryRebound(to: sockaddr.self, capacity: 1) { sockaddrPointer in
                bind(socketFD, sockaddrPointer, socklen_t(MemoryLayout<sockaddr_in>.size))
            }
        }

        guard bindResult == 0 else {
            close(socketFD)
            throw ServerError.bindFailed
        }

        guard listen(socketFD, SOMAXCONN) == 0 else {
            close(socketFD)
            throw ServerError.listenFailed
        }
    }

    func start() throws {
        print("HERBuddy is serving at http://localhost:\(port)")
        print("Open the browser to view the WalkBuddy prototype.")

        while true {
            let clientFD = accept(socketFD, nil, nil)
            guard clientFD >= 0 else { continue }
            handleClient(clientFD)
            close(clientFD)
        }
    }

    private func handleClient(_ clientFD: Int32) {
        let buffer = UnsafeMutablePointer<UInt8>.allocate(capacity: 8192)
        defer { buffer.deallocate() }

        let bytesRead = recv(clientFD, buffer, 8192, 0)
        guard bytesRead > 0 else { return }

        let requestData = Data(bytes: buffer, count: bytesRead)
        guard let requestText = String(data: requestData, encoding: .utf8) else { return }
        guard let firstLine = requestText.split(separator: "\n").first else { return }
        let parts = firstLine.split(separator: " ", omittingEmptySubsequences: false)
        guard parts.count >= 2 else { return }

        let method = String(parts[0]).uppercased()
        let rawPath = String(parts[1])

        if method != "GET" && method != "HEAD" {
            respondWithStatus(clientFD, status: "405 Method Not Allowed", body: "Method not allowed")
            return
        }

        let resourcePath = resolveRequestedPath(rawPath)
        guard let htmlData = try? Data(contentsOf: URL(fileURLWithPath: resourcePath)) else {
            respondWithStatus(clientFD, status: "404 Not Found", body: "File not found")
            return
        }

        let header = "HTTP/1.1 200 OK\r\nContent-Type: text/html; charset=utf-8\r\nContent-Length: \(htmlData.count)\r\nConnection: close\r\n\r\n"
        let headerData = Data(header.utf8)

        _ = headerData.withUnsafeBytes { headerBytes in
            send(clientFD, headerBytes.baseAddress!, headerBytes.count, 0)
        }

        if method == "GET" {
            _ = htmlData.withUnsafeBytes { bodyBytes in
                send(clientFD, bodyBytes.baseAddress!, bodyBytes.count, 0)
            }
        }
    }

    private func resolveRequestedPath(_ rawPath: String) -> String {
        let path = rawPath.hasPrefix("/") ? rawPath : "/\(rawPath)"
        let normalizedPath = path == "/" ? "/walk_buddy_unified_app.html" : path
        let fileName = normalizedPath.hasPrefix("/") ? String(normalizedPath.dropFirst()) : normalizedPath
        let resolvedFile = (documentRoot as NSString).appendingPathComponent(fileName)
        let fileURL = URL(fileURLWithPath: resolvedFile)
        if FileManager.default.fileExists(atPath: fileURL.path) {
            return fileURL.path
        }
        return (documentRoot as NSString).appendingPathComponent("walk_buddy_unified_app.html")
    }

    private func respondWithStatus(_ clientFD: Int32, status: String, body: String) {
        let payload = Data(body.utf8)
        let response = "HTTP/1.1 \(status)\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Length: \(payload.count)\r\nConnection: close\r\n\r\n"
        let responseData = Data(response.utf8)

        _ = responseData.withUnsafeBytes { responseBytes in
            send(clientFD, responseBytes.baseAddress!, responseBytes.count, 0)
        }

        _ = payload.withUnsafeBytes { payloadBytes in
            send(clientFD, payloadBytes.baseAddress!, payloadBytes.count, 0)
        }
    }
}

enum ServerError: Error {
    case socketCreationFailed
    case bindFailed
    case listenFailed
}

func main() {
    do {
        let currentDirectory = FileManager.default.currentDirectoryPath
        let server = try SimpleHTTPServer(port: 8080, documentRoot: currentDirectory)
        try server.start()
    } catch {
        let message = "HERBuddy failed to start the local server: \(error)\n"
        if let data = message.data(using: .utf8) {
            FileHandle.standardError.write(data)
        }
        exit(1)
    }
}

main()
