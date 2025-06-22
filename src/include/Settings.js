import interlock_backend from '@/providers/interlock_backend'
import ApiModel from '@/include/super/ApiModel'

class Settings extends ApiModel {

    key;
    value;

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
        return await interlock_backend.call('settings/list')
    }

    async fetch(presetId) {
        return await interlock_backend.call('settings/fetch', presetId)
    }

    async reset() {
        return await interlock_backend.call('settings/reset')
    }

    async test(data) {
        return await interlock_backend.call('settings/test', data)
    }

    async save(data) {
        return await interlock_backend.call('settings/save', data)
    }

    async sync_users() {
        return await interlock_backend.call('settings/sync_users')
    }

    async prune_users() {
        return await interlock_backend.call('settings/prune_users')
    }

    async purge_users() {
        return await interlock_backend.call('settings/purge_users')
    }

    async preset_create(data) {
        return await interlock_backend.call('settings/preset_create', data)
    }

    async preset_delete(data) {
        return await interlock_backend.call('settings/preset_delete', data)
    }

    async preset_rename(data) {
        return await interlock_backend.call('settings/preset_rename', data)
    }

    async preset_enable(data) {
        return await interlock_backend.call('settings/preset_enable', data)
    }
}

export default Settings