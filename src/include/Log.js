import interlock_backend from '@/providers/interlock_backend'
import ApiModel from '@/include/super/ApiModel'

class Log extends ApiModel {

    id;
    user;
    actionType;
    objectClass;
    affectedObject;
    extraMessage;

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
        return await interlock_backend.call('log/list')
    }
    async reset() {
        return await interlock_backend.call('log/reset')
    }
    async truncate(data) {
        return await interlock_backend.call('log/truncate', data)
    }
}

export default Log