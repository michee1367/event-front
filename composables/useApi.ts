import axios from "axios";

export const useApi = () => {
    const baseURL = "" // ou ton URL réelle
  
    const getAll = async (table:string) => {
      let {data} = await axios.get(`/api/models/records/${table}/save`)

      return data.data
    }
  
    const getOne = async (table:string, id:number) => {
      return await axios.get(`/api/get/${table}/${id}`)
    }
  
    const create = async (table:string, data:Record<string, string>) => {
      return await axios.post(`/api/models/insert/${table}`, {props:data})
    }
  
    const update = async (table:string, id:number, data:Record<string, string>) => {
      return await axios.put(`/api/post/${table}/${id}`, data)
    }
  
    return { getAll, getOne, create, update }
  }
  