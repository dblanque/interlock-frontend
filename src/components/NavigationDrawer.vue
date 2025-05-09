<template>
	<!-- SIDEBAR -->
	<v-navigation-drawer
		id="main-nav-drawer"
		ref="mainNavDrawer"
		class="ma-0 pa-0"
		v-model="navDrawerOpen"
		:expand-on-hover="!navDrawerKeepOpen && !mobile"
		:absolute="!navDrawerKeepOpen && !mobile"
		:mini-variant="!navDrawerOpen && !mobile"
		:permanent="!mobile"
		:temporary="mobile"
		:fixed="mobile"
		:bottom="mobile"
		:width="$vuetify.breakpoint.lgAndUp ? 380 : 280">
		<v-list dense nav expand>
			<!-- Top Tabs -->
			<v-list-item
				v-for="tab in topTabs"
				:key="tab.index"
				:color="componentColor"
				:input-value="tab.title == selectedTabTitle"
				@click="updateSelectedTab(tab.index)"
				:disabled="!tab.enabled || lockNavTabs">
				<v-list-item-icon>
					<v-icon>{{ tab.icon }}</v-icon>
				</v-list-item-icon>

				<v-list-item-content>
					<v-list-item-title>
						{{ $t("category." + tab.title) }}
					</v-list-item-title>
				</v-list-item-content>
				<v-list-item-action>
				</v-list-item-action>
			</v-list-item>
			<!-- Grouped Tabs -->
			<v-list-group
				v-for="navGroupSettings, navGroup in navGroups"
				v-model="openedGroup[navGroup]"
				:key="navGroup"
				:group="navGroup"
				:color="componentColor"
				:disabled="!navGroupSettings.enabled"
				:append-icon="!navGroupSettings.enabled ? 'mdi-minus' : undefined"
				multiple>
				<template v-slot:activator>
					<!-- About -->
					<v-tooltip
						:disabled="!('tooltip' in navGroupSettings) ||
							navGroupSettings.tooltip === undefined ||
							navGroupSettings === null"
						right
						color="primary">
						<template v-slot:activator="{ on, attrs }">
							<v-list-item class="ma-0 pa-0" dense v-bind="attrs" v-on="on">
								<v-list-item-icon>
									<v-icon>
										{{ navGroupSettings.icon }}
									</v-icon>
								</v-list-item-icon>
								<v-list-item-title>{{ $t("navgroup." + navGroup) }}</v-list-item-title>
							</v-list-item>
						</template>
						<span>{{ navGroupSettings.tooltip }}</span>
					</v-tooltip>
				</template>
				<v-list-item
					dense
					v-for="tab in getVisibleTabsInGroup(navGroup)"
					:key="tab.index"
					:color="componentColor"
					@click="updateSelectedTab(tab.index)"
					:input-value="tab.title == selectedTabTitle"
					:disabled="!tab.enabled || lockNavTabs">
					<v-list-item-icon>
						<v-icon>{{ tab.icon }}</v-icon>
					</v-list-item-icon>

					<v-list-item-content>
						<v-list-item-title v-if="$vuetify.breakpoint.lg && tab.enableShortName == true">
							{{ $t("category." + tab.title + "_short") }}
						</v-list-item-title>
						<v-list-item-title v-else>
							{{ $t("category." + tab.title) }}
						</v-list-item-title>
					</v-list-item-content>
					<v-list-item-action></v-list-item-action>
				</v-list-item>
			</v-list-group>

			<!-- Bottom Tabs -->
			<v-list-item
				v-for="tab in getVisibleTabsInGroup('_bot')"
				:key="tab.index"
				:color="componentColor"
				@click="updateSelectedTab(tab.index)"
				:input-value="tab.title == selectedTabTitle"
				:disabled="!tab.enabled || lockNavTabs">
				<v-list-item-icon>
					<v-icon>{{ tab.icon }}</v-icon>
				</v-list-item-icon>

				<v-list-item-content>
					<v-list-item-title v-if="$vuetify.breakpoint.lg && tab.enableShortName == true">
						{{ $t("category." + tab.title + "_short") }}
					</v-list-item-title>
					<v-list-item-title v-else>
						{{ $t("category." + tab.title) }}
					</v-list-item-title>
				</v-list-item-content>
				<v-list-item-action>
				</v-list-item-action>
			</v-list-item>
		</v-list>

		<!-- Nav Collapse -->
		<template v-slot:prepend>
			<v-list dense nav expand v-if="!mobile">
				<v-list-item @click="setNavDrawerKeepOpen">
					<v-list-item-icon class="align-self-center justify-center">
						<v-slide-x-reverse-transition>
							<v-icon small v-if="!navDrawerKeepOpen">mdi-arrow-expand-right</v-icon>
						</v-slide-x-reverse-transition>
					</v-list-item-icon>
					<v-list-item-content>
						<v-list-item-title>
							{{ navDrawerKeepOpen ? $t("nav.collapse") : $t("nav.keepOpen") }}
						</v-list-item-title>
					</v-list-item-content>
					<v-list-item-action class="my-0">
						<v-slide-x-transition>
							<v-icon small v-if="navDrawerKeepOpen">mdi-arrow-collapse-left</v-icon>
						</v-slide-x-transition>
					</v-list-item-action>
				</v-list-item>
			</v-list>
		</template>
	</v-navigation-drawer>
</template>

<script>
export default {
	data() {
		return {
			navDrawerOpen: false,
			navDrawerKeepOpen: false,
			openedGroup: {},
			componentColor: "primary-45",
		}
	},
	props: {
		mobile: {
			type: Boolean,
			default: false
		},
		expandedOnCreate: Boolean,
		selectedTab: Number,
		selectedTabTitle: String,
		navGroups: Object,
		topTabs: Array,
		bottomTabs: Array,
		lockNavTabs: Boolean,
		getVisibleTabsInGroup: Function
	},
	computed: {
		cookieNavDrawerKeepOpen: () => {
			let _v = localStorage.getItem("nav")
			if (_v !== "true" && _v !== "false")
				return undefined
			return localStorage.getItem("nav") === "true"
		}
	},
	created() {
		if (this.expandedOnCreate === true && this.cookieNavDrawerKeepOpen !== false)
			this.navDrawerKeepOpen = true;
		if (!this.mobile)
			this.navDrawerOpen = true;
	},
	methods: {
		closeAllNavGroups(){
			this.openedGroup = {}
		},
		setNavDrawerKeepOpen() {
			this.navDrawerKeepOpen = !this.navDrawerKeepOpen
			localStorage.setItem("nav", this.navDrawerKeepOpen)
		},
		updateSelectedTab(tabIndex) {
			this.$emit("updateSelectedTab", tabIndex);
		},
		toggle() {
			this.navDrawerOpen = !this.navDrawerOpen;
		},
	}
}
</script>