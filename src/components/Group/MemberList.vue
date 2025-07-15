<template>
	<div>
		<!-- MEMBER BUTTONS -->
		<v-row justify="center" class="ma-0 pa-0 my-4" v-if="showActions">
			<v-col cols="8" class="ma-0 pa-0">
				<v-btn @click="openAddMember"
					rounded text color="primary" outlined :disabled="!editFlag" class="pa-3">
					<v-icon small class="mr-1">mdi-plus</v-icon>
					{{ $t("actions.addN") + " " + $t("words.member") }}
				</v-btn>
			</v-col>
		</v-row>

		<!-- MEMBER EXPANSION PANEL -->
		<v-row align-content="center" justify="center" v-if="showMembers"
			class="ma-0 pa-0 my-4">
			<v-col cols="10" md="8" class="ma-0 pa-0">
				<v-expansion-panels :value="memberPanelExpanded" flat
					:style="`border: 1px solid var(${getExpansionPanelBorderColor});`">
				<v-expansion-panel>
					<v-expansion-panel-header>
						{{ $t('section.groups.groupDialog.members') }}
					</v-expansion-panel-header>
					<v-expansion-panel-content>
					<v-list dense>
						<v-list-item v-for="member, key in members" :key="key"
							:class="key != 0 ? 'border-bottom' : 'border-block'">
							<v-list-item-icon v-if="!flatData">
								<v-icon v-if="isUserType(member)">
									mdi-account
								</v-icon>
								<v-icon v-else-if="isGroupType(member)">
									mdi-google-circles-communities
								</v-icon>
								<v-icon v-else>
									mdi-group
								</v-icon>
							</v-list-item-icon>
							<v-list-item-icon v-else>
								<v-icon>mdi-archive</v-icon>
							</v-list-item-icon>

							<v-list-item-content>
								<v-row v-if="isUserType(member)"
									align="center" justify="center">
									<v-col cols="12" class="pa-0 ma-0 px-1">
										<span class="ma-0 pa-0">
											{{ `${$tc('classes.user', 1)}: ` }}
											{{ getMemberUserName(member) }}
										</span>
									</v-col>
								</v-row>
								<v-row v-else-if="isGroupType(member)"
									align="center" justify="center">
									<v-col cols="12" class="pa-0 ma-0 px-1">
										<span class="ma-0 pa-0">
											{{ `${$tc('classes.group', 1)}: ${member.name}` }}
										</span>
									</v-col>
								</v-row>
								<v-row v-else align="center" justify="center">
									<v-col cols="12" class="pa-0 ma-0 px-1">
										{{ flatData ? member : member.distinguished_name }}
									</v-col>
								</v-row>
							</v-list-item-content>

							<v-list-item-action class="pa-0 ma-0" v-if="!flatData">
								<v-tooltip bottom color="primary">
									<template v-slot:activator="{ on, attrs }">
										<v-btn small icon
											color="primary"
											v-bind="attrs"
											v-on="on">
											<v-icon small>
												mdi-help-circle
											</v-icon>
										</v-btn>
									</template>
									<span> {{ flatData ? member : member.distinguished_name }} </span>
								</v-tooltip>
							</v-list-item-action>

							<v-list-item-action class="pa-0 ma-0">
								<v-tooltip bottom>
									<template v-slot:activator="{ on, attrs }">
										<v-btn small icon
											@click="copyText(
												flatData ? member : member.distinguished_name
											)"
											color="primary"
											v-bind="attrs"
											v-on="on">
											<v-icon small>
												mdi-content-copy
											</v-icon>
										</v-btn>
									</template>
									<span> 
										{{ $t("section.groups.groupDialog.copyDistinguishedName") }}
									</span>
								</v-tooltip>
							</v-list-item-action>

							<v-list-item-action class="pa-0 ma-0">
								<v-tooltip
									bottom
									color="red">
									<template v-slot:activator="{ on, attrs }">
										<v-btn small icon
											@click="removeMember(
												flatData ? member : member.distinguished_name
											)"
											color="red"
											:disabled="!editFlag"
											v-bind="attrs"
											v-on="on">
											<v-icon small>
												mdi-close
											</v-icon>
										</v-btn>
									</template>
									<span> {{ $t("actions.remove") }} </span>
								</v-tooltip>
							</v-list-item-action>
						</v-list-item>
					</v-list>
					</v-expansion-panel-content>
				</v-expansion-panel>
				</v-expansion-panels>
			</v-col>
		</v-row>
	</div>
</template>

<script>
import { LDAPUserClasses } from '@/include/constants/LDAPUser.js';

export default {
	name: 'MemberList',
	props: {
		members: {
			type: Array,
		},
		flatData: {
			type: Boolean,
			default: false,
		},
		editFlag: Boolean,
		showMembers: {
			type: Boolean,
			default: true
		},
		showActions: {
			type: Boolean,
			default: true
		},
	},
	data() {
		return {
			userClasses: LDAPUserClasses,
			memberPanelExpanded: [],
		};
	},
	mounted() {
	},
	computed: {
		getExpansionPanelBorderColor() {
			if (
				this.memberPanelExpanded !== undefined &&
				this.memberPanelExpanded !== null
			) {
				if (this.memberPanelExpanded.length >= 1) {
					return "--v-primary-base"
				}
			}
			return "--v-gray-80-base"
		},
	},
	methods: {
		openAddMember() {
			this.$emit("open-add-member")
			this.$emit("openAddMember")
		},
		getMemberUserName(member) {
			if (member?.first_name && member?.last_name)
				return `${member.first_name} ${member.last_name} (${member.username})`
			if (member?.username)
				return member?.username
			return member
		},
		copyText(textString) {
			navigator.clipboard.writeText(textString);
		},
		removeMember(distinguished_name) {
			this.$emit("remove", distinguished_name)
		},
		isUserType(item) {
			if (!this.flatData)
				return false
			if (!item?.object_class)
				return false
			let isUser = false
			item.object_class.forEach(v => {
				if (this.userClasses.includes(v))
					isUser = true
			})
			return isUser
		},
		isGroupType(item) {
			if (!this.flatData)
				return false
			if (!item?.object_class)
				return false
			return item.object_class.includes("group")
		},
	},
};
</script>