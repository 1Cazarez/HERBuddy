import Foundation
import FirebaseCore
import FirebaseAuth
import FirebaseFirestore

FirebaseApp.configure()

let db = Firestore.firestore()
let auth = Auth.auth()

print("HERBuddy initialized with Firebase.")
print("Firestore: \(db)")
print("Auth: \(auth)")
