
export interface Auth {
  page_id?: string
  page_name?: string
  auth?: Array<string>
}

export interface AuthInfo {
  app_3?: Array<Auth>
  config_tool?: Array<Auth>
  notice?: Array<Auth>
  temp_assist?: Array<Auth>
  transport?: Array<Auth>
  webpage?: Array<Auth>
}

export interface Role {
  acc_id?: string
  auth_info?: AuthInfo
  notify_info?: string
  role_id?: number
  role_name?: string
  role_weight?: number
  type?: string
}

