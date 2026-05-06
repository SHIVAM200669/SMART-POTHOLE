import Foundation

struct Worker: Identifiable, Codable {
    let id: Int
    let name: String
    let phone: String
    let availability: Bool
    
    enum CodingKeys: String, CodingKey {
        case id
        case name
        case phone
        case availability
    }
}
