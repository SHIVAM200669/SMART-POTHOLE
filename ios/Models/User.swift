import Foundation

struct User: Identifiable, Codable {
    let id: Int
    let email: String
    let name: String
    let role: String // "user" or "admin"
    
    enum CodingKeys: String, CodingKey {
        case id
        case email
        case name = "username" // Adjusting based on standard conventions, update if backend is different
        case role
    }
}

struct AuthResponse: Codable {
    let token: String
    let user: User
}
