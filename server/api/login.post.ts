import Axios, { AxiosError } from "axios";
import https from "https";
import { EventHandlerRequest, H3Event } from "h3";

const rolesAuth = [
]

const instance = Axios.create({
    httpsAgent: new https.Agent({
      rejectUnauthorized: false
    })
});

let getToken = async (dataAgrs:RequestData, event: H3Event<EventHandlerRequest>) : Promise<User>  => {
    
    try 
    {
      //username
      let body = {...dataAgrs.body}
      body.token = body.token

      console.log("###############")
      console.log(body)
      console.log("###############")

      let { data } = await instance.post(
        `${process.env.GOOGLE_URL}`,
          {
            "token":body.token
          },
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      )
      console.log(data)
      return {
        jwt_token:data.jwt_token,
        phone:data?.user?.phone,
        nom:data?.user?.nom,
        post_nom:data?.user?.post_nom,
        prenom:data?.user?.prenom,
        roles:data?.user?.roles,
      }
  
    } catch (error) {
      /**
       * 
       */
      let err = catchError(error)
      //console.log(error)
      
      throw err
    }
  
}

export default defineEventHandler(async (event) => {
    let sessionData = await useSession(event, config)
    let user = sessionData.data.user
    //console.log("################")
    
    let body = {
        body:await readBody(event),
        user: user
    }
    user = await getToken(body, event)
    let rolesUser = user?.roles ? user.roles : [];

    //console.log(rolesUser)

    let isNotAuth = !rolesAuth.find(
      (roleAuth) => {
        return rolesUser.find(
          role => role == roleAuth
        )
      }
    )

   /* if (isNotAuth) {

      throw createError({
          "statusCode": 403,
          "statusMessage": "unauthorization",
          "data" : {}
      })

    }*/
    let access_token = user.access_token

    let data = {
      names : user.prenom + " " + user.nom + " " + user.post_nom,
      phone : user.phone,
      email : user.email,
      jwt_token : user.jwt_token,
      roles : user.roles
    }
    //data.access_token =undefined
    //data.refresh_token =undefined
    
    //data.roles = undefined
    //console.log(data)
    let updated = {...sessionData.data}  
    updated.user = {...data}
    
    //updated.access_token = access_token
    await sessionData.update(updated)
    data.jwt_token = null
    //data.access_token =undefined

    return  {
        user: data
    }
})
