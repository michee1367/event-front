const ADMIN_ROLE="ROLE_ADMIN"
const ROLE_CAISSIER="ROLE_CAISSIER"
const ROLE_CONTROLLEUR_FINANCIER="ROLE_CONTROLLEUR_FINANCIER"
import * as tables from "@/tools/table";

export function is_admin(user) {
    console.log("user###################")
    console.log(user)
    return user.user.roles.find(role => role == ADMIN_ROLE)
}

export function is_chasher(user) {
    return user.user.roles.find(role => role == ROLE_CAISSIER)    
}
export function is_finance_controller(user) {
    return user.user.roles.find(role => role == ROLE_CONTROLLEUR_FINANCIER)        
}

export function is_visitor(user) {
    return user.user.roles.find(role => role != ADMIN_ROLE && role != ROLE_CONTROLLEUR_FINANCIER && role != ROLE_CAISSIER)  
    
}

export function can_acccess_page(user, table) {
    let cashers =  [tables.TARIF, tables.TRANSATION, tables.WORK_SHIFT]
    let controllers =  [tables.TARIF, tables.RECONCILIATION_FILE, tables.RECONCILIATION_LINE, tables.VEHICLE_PASSED]
    let admins = [tables.EQUIPMENT, tables.EVENT, tables.LANE, tables.SUPPLIER, tables.TARIF, 
        tables.TOLL_BOOTH, tables.USER, tables.VEHICLE, tables.VEHICLE_PASSED, tables.VEHICLE_CATEGORY]
        
    return user.user.roles.find(role => {
        role != ADMIN_ROLE && role != ROLE_CONTROLLEUR_FINANCIER && role != ROLE_CAISSIER;
        if(role == ADMIN_ROLE) {
            return admins.find( tableExist => tableExist == table)
        }else if(role == ROLE_CONTROLLEUR_FINANCIER) {
            return controllers.find( tableExist => tableExist == table)

        }else if(role == ROLE_CAISSIER) {
            return cashers.find( tableExist => tableExist == table)

        }else {
            return false
        }
    })


}