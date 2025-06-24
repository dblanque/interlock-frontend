import interlock_backend from '@/providers/interlock_backend'
import ApiModel from '@/include/super/ApiModel'

class Domain extends ApiModel {

    domain;
    realm;

    /**
     * Fetches model instance from API by id.
     * @param {Number} id 
     */
    constructor(data) {
        super(data)
        Object.keys(data).forEach(key => {
            this[key] = data[key];
        });
    }

    async getDetails() {
        return await interlock_backend.call('domain/details')
    }

    async zones(data) {
        return await interlock_backend.call('domain/zones', data)
    }

    async insert(data) {
        return await interlock_backend.call('domain/insert', data)
    }

    async delete(data) {
        return await interlock_backend.call('domain/delete', data)
    }
}

export default Domain