import interlock_backend from '@/providers/interlock_backend'
import ApiModel from '@/include/super/ApiModel'

class TOTPDevice extends ApiModel {

    device_name;
    config_url;
    label;
    // tolerance;
    // drift;
    // digits;

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

    /**
     * Creates TOTP Device with URI for User, Standard Call.
     * @returns Response Promise, Exception on Failure.
     */
    async create() {
        return await interlock_backend.call('totp/create')
    }

    /**
     * Validates TOTP Device with TOTP Code from User, Standard Call.
     * @returns Response Promise, Exception on Failure.
     */
    async validate(data) {
        return await interlock_backend.call('totp/validate', data)
    }

    async delete() {
        return await interlock_backend.call('totp/delete')
    }

    async list() {
        return await interlock_backend.call('totp/list')
    }
}

export default TOTPDevice