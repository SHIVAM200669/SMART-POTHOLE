import SwiftUI
import Foundation

class AuthViewModel: ObservableObject {
    @Published var email = ""
    @Published var password = ""
    @Published var username = ""
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    @AppStorage(Constants.Keys.jwtToken) var token: String = ""
    @AppStorage(Constants.Keys.userRole) var userRole: String = ""
    
    var isAuthenticated: Bool {
        !token.isEmpty
    }
    
    func login() {
        guard !email.isEmpty, !password.isEmpty else {
            errorMessage = "Please fill all fields"
            return
        }
        
        isLoading = true
        errorMessage = nil
        
        let body: [String: Any] = ["email": email, "password": password]
        guard let data = try? JSONSerialization.data(withJSONObject: body) else { return }
        
        Task {
            do {
                let response: AuthResponse = try await NetworkManager.shared.request(
                    url: Constants.API.login,
                    method: "POST",
                    body: data,
                    requiresAuth: false
                )
                
                DispatchQueue.main.async {
                    self.token = response.token
                    self.userRole = response.user.role
                    self.isLoading = false
                }
            } catch {
                DispatchQueue.main.async {
                    self.errorMessage = "Login failed: \(error.localizedDescription)"
                    self.isLoading = false
                }
            }
        }
    }
    
    func signup() {
        guard !email.isEmpty, !password.isEmpty, !username.isEmpty else {
            errorMessage = "Please fill all fields"
            return
        }
        
        isLoading = true
        errorMessage = nil
        
        let body: [String: Any] = ["username": username, "email": email, "password": password, "role": "user"]
        guard let data = try? JSONSerialization.data(withJSONObject: body) else { return }
        
        Task {
            do {
                let response: AuthResponse = try await NetworkManager.shared.request(
                    url: Constants.API.signup,
                    method: "POST",
                    body: data,
                    requiresAuth: false
                )
                
                DispatchQueue.main.async {
                    self.token = response.token
                    self.userRole = response.user.role
                    self.isLoading = false
                }
            } catch {
                DispatchQueue.main.async {
                    self.errorMessage = "Signup failed: \(error.localizedDescription)"
                    self.isLoading = false
                }
            }
        }
    }
    
    func logout() {
        token = ""
        userRole = ""
    }
}
