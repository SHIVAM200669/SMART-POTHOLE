import Foundation

struct Report: Identifiable, Codable {
    let id: Int
    let userId: Int
    let locationLat: Double
    let locationLng: Double
    let description: String?
    let imageUrl: String
    let status: String // "pending", "in-progress", "completed"
    let confidenceScore: Double?
    let createdAt: String
    
    enum CodingKeys: String, CodingKey {
        case id
        case userId = "user_id"
        case locationLat = "location_lat"
        case locationLng = "location_lng"
        case description
        case imageUrl = "image_url"
        case status
        case confidenceScore = "confidence_score"
        case createdAt = "created_at"
    }
}
