import authCalls from '@/providers/interlock_backend/modules/auth.js'
import userCalls from '@/providers/interlock_backend/modules/user.js'
import groupCalls from '@/providers/interlock_backend/modules/group.js'
import ouCalls from '@/providers/interlock_backend/modules/organizationalUnit.js'
import domainCalls from '@/providers/interlock_backend/modules/domain.js'
import settingCalls from '@/providers/interlock_backend/modules/settings.js'

const modules = {
    auth: authCalls,
    user: userCalls,
    group: groupCalls,
    ou: ouCalls,
    settings: settingCalls,
    domain: domainCalls,
}

const interlock_backend = {
    call: (moduleCallLinkString, params) => {
        if(!moduleCallLinkString)
            throw Error("Missing Link String Parameters. Linking String provided is undefined.")
        var links = moduleCallLinkString.split('/')
        if(links.length == 1)
            throw Error("Missing Link String Parameters. Linking String Example 'module/call'.")
        else if (!(links[0] in modules))
            throw Error("Module `" +links[0]+ "` not registered in provider modules.")
        else if (!(links[1] in modules[links[0]]))
            throw Error("Function `" +links[1]+ "` was not found in `"+links[0]+"` module.")
        else{
            return modules[links[0]][links[1]](params)
        }
    }
}

export default interlock_backend