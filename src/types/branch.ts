
export interface Branch {
  acc_id?: string
  access_time?: AccessTime
  branch_code?: string
  branch_id?: string
  branch_name?: Contact
  descr?: string
  groups?: Array<Define>
  status?: number
}

export interface Define {
  code?: string
  id?: string
  name?: string
  type?: string
}

export interface Contact {
  address?: string
  country?: string
  tel?: string
  time_zone?: string
  zone_1?: string
  zone_2?: string
}

export interface AccessTime {
  update?: string
}
