import Foundation

struct Constants {
    struct API {
        // Base URL pointing to local server for now
        static let baseURL = "http://localhost:5000"
        
        // Auth Endpoints
        static let login = "\(baseURL)/auth/login"
        static let signup = "\(baseURL)/auth/signup"
        
        // Complaint Endpoints
        static let complaints = "\(baseURL)/complaints"
        static let dashboard = "\(baseURL)/complaints/dashboard"
        
        // Admin/Worker Endpoints
        static let workers = "\(baseURL)/workers"
    }
    
    struct Keys {
        static let jwtToken = "jwt_token"
        static let userRole = "user_role"
    }
}
