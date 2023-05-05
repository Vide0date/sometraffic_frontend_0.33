export type IRegistrationErrors = {
 hasErrors?: string
}

export type RegistationResponse = {
 hasErrors: boolean,
 errors?: IRegistrationErrors
}

export type RegistationRequest = {
 userName?: string
 email?: string
 password?: string
}