import interlock_backend from '@/providers/interlock_backend'
import ApiModel from '@/include/super/ApiModel'

class GPO extends ApiModel {

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

    async list() {
        return await interlock_backend.call('gpo/list')
    }
}

export default GPO