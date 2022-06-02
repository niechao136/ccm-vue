import { User } from './user'
import { Role } from './role'

export interface Response {
  status?: number
  error_code?: string
  error_message?: string
}

export interface Token {
  token_id?: string
  key?: string
}

export interface LoginResponse extends Response {
  user_id?: string
  token?: Token
}

export interface UserInfoResponse extends Response {
  user?: User
}

export interface RoleInfoResponse extends Response {
  role?: Role
}

export interface TokenInfo {
  token_id?: number
  token?: string
}

export interface StoreVueToken {
  acc_id?: string
  user_id?: string
  status?: number
  token?: TokenInfo
}

export interface CCMToken {
  acc_id?: string
  user_id?: string
  status?: number
  token?: Token
}
