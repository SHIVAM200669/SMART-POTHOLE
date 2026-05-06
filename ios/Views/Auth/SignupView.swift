import SwiftUI

struct SignupView: View {
    @ObservedObject var viewModel: AuthViewModel
    @Environment(\.presentationMode) var presentationMode
    
    var body: some View {
        VStack(spacing: 24) {
            HStack {
                Button(action: {
                    presentationMode.wrappedValue.dismiss()
                }) {
                    Image(systemName: "arrow.left")
                        .font(.title2)
                        .foregroundColor(Theme.textPrimary)
                }
                Spacer()
            }
            .padding(.top)
            
            VStack(alignment: .leading, spacing: 8) {
                Text("Create Account")
                    .font(Theme.Typography.title)
                Text("Join the community to report road issues.")
                    .font(Theme.Typography.body)
                    .foregroundColor(Theme.textSecondary)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.bottom, 24)
            
            VStack(spacing: 16) {
                TextField("Username", text: $viewModel.username)
                    .customTextField()
                
                TextField("Email", text: $viewModel.email)
                    .keyboardType(.emailAddress)
                    .autocapitalization(.none)
                    .customTextField()
                
                SecureField("Password", text: $viewModel.password)
                    .customTextField()
            }
            
            if let error = viewModel.errorMessage {
                Text(error)
                    .foregroundColor(.red)
                    .font(Theme.Typography.caption)
            }
            
            Button(action: {
                viewModel.signup()
            }) {
                if viewModel.isLoading {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: .white))
                } else {
                    Text("Sign Up")
                }
            }
            .buttonStyle(PrimaryButtonStyle())
            .disabled(viewModel.isLoading)
            
            Spacer()
        }
        .padding()
        .background(Theme.background.ignoresSafeArea())
        .navigationBarHidden(true)
    }
}
