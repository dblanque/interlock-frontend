import interlock_backend from '@/providers/interlock_backend'
import ApiModel from '@/include/super/ApiModel'

class DNSRecord extends ApiModel{

    name;
    nameExchange;
    address;
    typeName;
    serial;
    ts;
    nameTarget;
    type;
    tstime;
    wPreference;
    wPriority;
    wWeight;
    wPort;
    dwSerialNo;
    dwRefresh;
    dwRetry;
    dwExpire;
    dwMinimumTtl;
    namePrimaryServer;
    zoneAdminEmail;
    
    /**
     * Fetches model instance from API by id.
     * @param {Number} id 
     */
     constructor(data){
        super(data)
        Object.keys(data).forEach(key => {
            this[key] = data[key];
        });
    }

    async insert(data){
        return await interlock_backend.call('dnsr/insert', data)
    }

    async update(data){
        return await interlock_backend.call('dnsr/update', data)
    }

    async delete(data){
        return await interlock_backend.call('dnsr/delete', data)
    }
}

export default DNSRecord