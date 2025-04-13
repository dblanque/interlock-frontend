<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!------------------------- File: UserDialog.vue ------------------------------>
<template>
	<v-card :loading="refreshLoading" class="pa-0 ma-0">
		<v-progress-linear :color="loadingColor" :indeterminate="refreshLoading || loading" />
		<v-expand-transition>
			<div v-show="!refreshLoading">
				<!-- Title Bar -->
				<v-card-title class="ma-0 pa-0 card-title">
					<v-row class="ma-0 pa-0 ma-1" align="center" justify="space-between">
						<!-- Header -->
						<h3
							v-if="!usercopy.givenName || usercopy.givenName == '' || !usercopy.sn || usercopy.sn == ''"
							class="pa-0 ma-0 ma-2">
							{{ usercopy.username ? $tc('classes.user', 1) + ': ' + usercopy.username
								: '' }}
						</h3>
						<h3 v-else class="pa-0 ma-0 ma-2">
							{{ $tc('classes.user', 1) + ': ' + usercopy.givenName + " " + usercopy.sn }}
						</h3>
						<v-divider v-if="$vuetify.breakpoint.mdAndUp" class="mx-4" />
						<v-btn small color="primary" @click="goToTargetTab(tab - 1)" v-if="isLDAPView()"
							class="ma-0 pa-0 py-2 pr-1 pl-3 ma-1">
							<v-fade-transition>
								<span v-if="tab - 1 == TABS.PERMS || tab - 1 < 0">
									{{ $t("actions.changeUserPerms") }}
								</span>
								<span v-else-if="tab - 1 == TABS.GROUPS">
									{{ $t("actions.changeUserGroups") }}
								</span>
								<span v-else>
									{{ $t("section.users.userDialog.userDetails") }}
								</span>
							</v-fade-transition>
							<v-icon>mdi-chevron-left</v-icon>
						</v-btn>
						<v-btn small color="primary" @click="goToTargetTab(tab + 1)" v-if="isLDAPView()"
							class="ma-0 pa-0 py-2 pr-1 pl-3 ma-1">
							<v-fade-transition>
								<span v-if="tab + 1 == TABS.PERMS">
									{{ $t("actions.changeUserPerms") }}
								</span>
								<span v-else-if="tab + 1 == TABS.GROUPS || tab + 1 > Object.keys(TABS).length - 1">
									{{ $t("actions.changeUserGroups") }}
								</span>
								<span v-else>
									{{ $t("section.users.userDialog.userDetails") }}
								</span>
							</v-fade-transition>
							<v-icon>mdi-chevron-right</v-icon>
						</v-btn>
						<v-btn icon color="red" class="ma-2" rounded @click="closeDialog">
							<v-icon>
								mdi-close
							</v-icon>
						</v-btn>
					</v-row>
				</v-card-title>

				<!-- Alert -->
				<v-expand-transition>
					<v-row v-show="editFlag && showAlert" justify="center" class="pa-0 ma-0">
						<v-alert class="pa-0 ma-1 pa-4 pb-3 mt-3" border="top" type="warning" :icon="false">
							<v-icon class="mdso mr-2">warning</v-icon>
							{{ $t('section.users.editFlagWarning') }}
							<v-btn @click="viewUser" small class="ma-0 pa-0 ml-2 pr-2 pl-1">
								<v-icon color="orange" class="">mdi-chevron-left</v-icon>
								{{ $t('actions.back') }}
							</v-btn>
						</v-alert>
					</v-row>
				</v-expand-transition>
				<v-expand-transition>
					<v-row
						v-show="!editFlag && showAlert"
						justify="center" class="pa-0 ma-0">
						<v-alert class="pa-0 ma-1 pa-4 pb-3 mt-3" border="top" type="info" :icon="false">
							<v-icon class="mr-2">mdi-eye-circle</v-icon>
							{{ $t('section.users.viewFlagWarning') }}
							<v-btn @click="editUser" small class="ma-0 pa-0 ml-2 pr-2 pl-1"
								:disabled="isLDAPUser() && !isLDAPView()">
								<v-icon color="blue" class="mx-1" small>mdi-pencil</v-icon>
								{{ $t('actions.edit') }}
							</v-btn>
						</v-alert>
					</v-row>
				</v-expand-transition>

				<!-- Body -->
				<v-tabs v-model="tab" height="0">
					<!-- GROUPS SCREEN -->
					<v-tab-item :key="0">
						<v-card-text class="my-3 py-4">
							<v-row justify="center">
								<v-col cols="12" md="10">
									<v-select
										dense
										id="primaryGroupID"
										:label="$t('attribute.ldap.primaryGroupID')"
										:readonly="editFlag != true"
										v-model="usercopy.primaryGroupID"
										:items="this.usercopy.memberOfObjects"
										:hint="$t('section.users.userDialog.hint.primaryGroupID')"
										persistent-hint
										:item-text="getNameForPID"
										item-value="objectRid"></v-select>
								</v-col>
							</v-row>
							<v-row justify="center" align-content="center" class="mb-2">
								<v-col class="ma-0 pa-0" cols="12" md="10">
									<v-card outlined height="100%" class="ma-1 pa-0 pt-4">
										<v-row justify="center"
											class="pa-0 ma-0 text-h6 mx-4 mb-2">
											{{ $t('section.users.groups') }}
										</v-row>
										<v-divider class="mx-12" />
										<v-list dense>
											<v-row class="ma-0 pa-0 mx-6 my-3" justify="end">
												<v-btn color="primary" outlined
													:disabled="editFlag != true"
													@click="openDialog('userAddToGroup')">
													<v-icon small>
														mdi-plus
													</v-icon>
													{{ $t("section.users.userDialog.addToGroup") }}
												</v-btn>
											</v-row>
											<v-list-item-group active-class="groupSelected">
												<v-list-item v-for="group, key in usercopy.memberOfObjects" :key="key">
													<template v-slot:default="{ }">
														<v-list-item-action />

														<v-list-item-content>
															<v-list-item-title>
																{{ group.name + (group.objectRid && group.objectRid.length > 0 ?
																	`(${group.objectRid})` : "") }}
															</v-list-item-title>
														</v-list-item-content>

														<v-list-item-action class="ma-0">
															<v-tooltip bottom>
																<template v-slot:activator="{ on, attrs }">
																	<v-btn small icon
																		@click="goToGroup(group.distinguishedName)"
																		@click.stop
																		color="primary"
																		v-bind="attrs"
																		v-on="on">
																		<v-icon small>
																			mdi-arrow-right-bold
																		</v-icon>
																	</v-btn>
																</template>
																<span> {{ $t("actions.goTo") + " " + $tc("classes.group", 1) }}
																</span>
															</v-tooltip>
														</v-list-item-action>
														<v-list-item-action class="ma-0">
															<v-tooltip bottom>
																<template v-slot:activator="{ on, attrs }">
																	<v-btn small icon
																		@click="copyText(group.distinguishedName)"
																		@click.stop
																		color="primary"
																		v-bind="attrs"
																		v-on="on">
																		<v-icon small>
																			mdi-content-copy
																		</v-icon>
																	</v-btn>
																</template>
																<span> {{ $t("section.groups.groupDialog.copyDistinguishedName") }}
																</span>
															</v-tooltip>
														</v-list-item-action>
														<v-list-item-action class="ma-0">
															<v-tooltip bottom>
																<template v-slot:activator="{ on, attrs }">
																	<v-btn small icon
																		v-show="group.objectRid != usercopy.primaryGroupID"
																		:disabled="editFlag != true"
																		@click="removeFromGroup(group.distinguishedName)"
																		@click.stop
																		color="red"
																		v-bind="attrs"
																		v-on="on">
																		<v-icon small>
																			mdi-close
																		</v-icon>
																	</v-btn>
																	<v-btn small icon
																		v-show="group.objectRid == usercopy.primaryGroupID"
																		@click.stop
																		v-bind="attrs"
																		v-on="on">
																		<v-icon small>
																			mdi-close
																		</v-icon>
																	</v-btn>
																</template>
																<span v-if="group.objectRid != usercopy.primaryGroupID"> {{
																	$t("section.users.userDialog.removeFromGroup") }} </span>
																<span v-else> {{
																	$t("section.users.userDialog.primaryGroupRemoveDisabled") }}
																</span>
															</v-tooltip>
														</v-list-item-action>
													</template>
												</v-list-item>
											</v-list-item-group>
										</v-list>
									</v-card>
								</v-col>
							</v-row>
						</v-card-text>
					</v-tab-item>

					<v-tab-item :key="1">
						<v-card-text class="ma-0 py-4">
							<v-form ref="userForm" @submit.prevent>
								<!-- LDAP USER DATA -->
								<v-row align-content="center" class="mb-2" v-if="isLDAPView()">
									<!-- User Basic Data Panel -->
									<v-col class="ma-0 pa-0" cols="12" md="6">
										<v-card outlined height="100%" class="ma-1 pa-4">
											<v-row :justify="this.$vuetify.breakpoint.smAndDown ? 'center' : 'start'"
												class="pa-0 ma-0 text-h6 mx-4 mb-5">
												{{ $t('section.users.basicDetails') }}
											</v-row>
											<v-row class="pa-0 ma-0 font-weight-medium">
												<v-col cols="12" lg="6">
													<v-text-field dense id="givenName" :label="$t('attribute.ldap.givenName')"
														:readonly="editFlag != true" v-model="usercopy.givenName"
														:rules="[this.fieldRules(usercopy.givenName, 'ge_name')]"></v-text-field>
												</v-col>
												<v-col cols="12" lg="6">
													<v-text-field dense id="sn" :label="$t('attribute.ldap.sn')"
														:readonly="editFlag != true" v-model="usercopy.sn"
														:rules="[this.fieldRules(usercopy.sn, 'ge_name')]"></v-text-field>
												</v-col>
												<v-col cols="12" lg="6"
													:class="this.$vuetify.breakpoint.smAndUp ? 'mt-3' : ''">
													<v-text-field dense id="mail" :label="$t('attribute.user.email')"
														:readonly="editFlag != true" v-model="usercopy.mail"
														:rules="[this.fieldRules(usercopy.mail, 'ge_mail')]"></v-text-field>
												</v-col>
												<v-col cols="12" lg="6">
													<v-fade-transition>
														<v-card v-ripple outlined class="pa-1 py-2">
															<span :color="(usercopy.is_enabled ? 'valid-40' : 'error')">
																{{ usercopy.is_enabled ? $t('attribute.user.is_enabled') :
																	$t('attribute.user.is_disabled') }}
															</span>
															<div elevation="0" v-if="usercopy.is_enabled == true">
																<v-icon color="valid-40">
																	mdi-check
																</v-icon>
															</div>
															<div elevation="0" icon rounded
																v-else-if="usercopy.is_enabled == false">
																<v-icon color="error">
																	mdi-close
																</v-icon>
															</div>
														</v-card>
													</v-fade-transition>
												</v-col>
												<v-col cols="12"
													v-if="user.last_login != undefined && user.last_login != ''">
													{{ $t('attribute.ldap.last_login') + ": " + user.last_login }}
												</v-col>
												<v-col cols="12" lg="6">
													<v-text-field dense id="telephoneNumber"
														:label="$t('attribute.ldap.telephoneNumber')"
														:readonly="editFlag != true"
														v-model="usercopy.telephoneNumber"
														:rules="[this.fieldRules(usercopy.telephoneNumber, 'ge_phone_intl')]"></v-text-field>
												</v-col>
												<v-col cols="12" lg="6">
													<v-text-field dense id="wWWHomePage"
														:label="$t('attribute.ldap.wWWHomePage')"
														:readonly="editFlag != true" v-model="usercopy.wWWHomePage"
														:rules="[this.fieldRules(usercopy.wWWHomePage, 'ge_website')]"></v-text-field>
												</v-col>
											</v-row>
										</v-card>
									</v-col>
									<!-- Location Panel -->
									<v-col class="ma-0 pa-0" cols="12" md="6">
										<v-card outlined height="100%" class="ma-1 pa-4">
											<v-row :justify="this.$vuetify.breakpoint.smAndDown ? 'center' : 'end'"
												class="pa-0 ma-0 text-h6 mx-4 mb-5">
												{{ $t('section.users.location') }}
											</v-row>
											<v-row class="pa-0 ma-0 font-weight-medium">
												<v-col cols="12" lg="6">
													<v-text-field dense id="streetAddress"
														:label="$t('attribute.ldap.streetAddress')"
														:readonly="editFlag != true" v-model="usercopy.streetAddress"
														:rules="[this.fieldRules(usercopy.streetAddress, 'ge_address_street')]"></v-text-field>
												</v-col>
												<v-col cols="12" lg="6">
													<v-text-field dense id="postalCode"
														:label="$t('attribute.ldap.postalCode')"
														:readonly="editFlag != true" v-model="usercopy.postalCode"
														:rules="[this.fieldRules(usercopy.postalCode, 'ge_address_postal_code')]"></v-text-field>
												</v-col>
												<v-col cols="12" lg="6"
													:class="this.$vuetify.breakpoint.smAndUp ? 'mt-3' : ''">
													<v-text-field dense id="l" :label="$t('attribute.ldap.l')"
														:readonly="editFlag != true" v-model="usercopy.l"
														:rules="[this.fieldRules(usercopy.l, 'ge_address_city')]"></v-text-field>
												</v-col>
												<v-col cols="12" lg="6">
													<v-card v-ripple outlined class="pa-1 py-2">
														<div
															v-if="usercopy.countryCode != undefined && usercopy.countryCode != '' && usercopy.countryCode != 0">
															{{ $t('attribute.ldap.countryCodeCombined') }}
															<div elevation="0">
																{{ usercopy.countryCode }}
																{{ "(" + usercopy.c + ")" }}
															</div>
														</div>
														<div v-else>
															{{ $t('attribute.ldap.countryCodeCombined') }}
															<div>
																{{ $t('error.data.noCountryCode') }}
															</div>
														</div>
													</v-card>
												</v-col>
												<v-col cols="12"
													v-if="user.last_login != undefined && user.last_login != ''">
													{{ $t('attribute.ldap.last_login') + ": " + user.last_login }}
												</v-col>
												<v-col cols="12" lg="6">
													<v-text-field dense id="st" :label="$t('attribute.ldap.st')"
														:readonly="editFlag != true" v-model="usercopy.st"
														:rules="[this.fieldRules(usercopy.st, 'ge_state')]"></v-text-field>
												</v-col>
												<v-col cols="12" lg="6">
													<v-autocomplete dense id="co" :label="$t('attribute.ldap.co')"
														:readonly="editFlag != true" v-model="usercopy.co"
														:items="LDAPCountries"
														:rules="[this.fieldRules(usercopy.co, 'ge_country')]">
													</v-autocomplete>
												</v-col>
											</v-row>
										</v-card>
									</v-col>
								</v-row>
								<v-row class="mt-2" v-if="isLDAPView()">
									<v-expansion-panels v-model="panel" flat class="ma-1">
										<v-expansion-panel class="outlined">
											<v-expansion-panel-header class="font-weight-medium">
												{{ $t("section.users.advancedDetails") }}
											</v-expansion-panel-header>
											<v-expansion-panel-content>
												<v-row>
													<v-col cols="12">
														<v-text-field dense id="distinguishedName"
															:label="$t('attribute.ldap.distinguishedName')" readonly
															v-model="usercopy.distinguishedName"
															:rules="[this.fieldRules(usercopy.distinguishedName, 'ldap_dn')]"></v-text-field>
													</v-col>
													<v-col cols="12" lg="6">
														<v-text-field dense id="userPrincipalName"
															:label="$t('attribute.ldap.userPrincipalName')" readonly
															:value="getUSN"
															:rules="[this.fieldRules(usercopy.userPrincipalName, 'ldap_usn')]"></v-text-field>
													</v-col>
													<v-col cols="12" lg="6"
														:justify="$vuetify.breakpoint.lgAndUp ? 'start' : 'center'">
														<v-text-field dense id="sAMAccountType"
															:label="$t('attribute.ldap.sAMAccountType')" readonly
															v-model="usercopy.sAMAccountType"
															:rules="[this.fieldRules(usercopy.sAMAccountType, 'ge_lettersStrictUnderscore')]"></v-text-field>
													</v-col>
												</v-row>
												<v-row :justify="$vuetify.breakpoint.lgAndUp ? 'start' : 'center'"
													align="center">
													<v-col cols="12" md="3">
														<v-btn outlined dense color="primary"
															@click="goToTargetTab(TABS.GROUPS)"
															class="ma-0 pa-0 py-2 pr-1 pl-3 ma-1">
															{{ $t("actions.changeUserGroups") }}
															<v-icon>mdi-chevron-left</v-icon>
														</v-btn>
													</v-col>
													<v-col cols="12" md="4">
														<v-select dense id="primaryGroupID"
															:label="$t('attribute.ldap.primaryGroupID')"
															:readonly="editFlag != true" v-model="usercopy.primaryGroupID"
															:items="this.usercopy.memberOfObjects"
															:hint="$t('section.users.userDialog.hint.primaryGroupID')"
															persistent-hint
															:item-text="getNameForPID" item-value="objectRid"></v-select>
													</v-col>
													<v-col cols="12" md="2">
														<v-text-field dense id="userAccountControl"
															:label="$t('attribute.ldap.userAccountControl')" readonly
															v-model="enabledPermInts"
															:rules="[this.fieldRules(enabledPermInts, 'ge_numbers')]"></v-text-field>
													</v-col>
													<v-col cols="12" md="3">
														<v-btn outlined color="primary" @click="goToTargetTab(TABS.PERMS)"
															class="ma-0 pa-0 py-2 pr-1 pl-3 ma-1">
															{{ $t("actions.changeUserPerms") }}
															<v-icon>mdi-chevron-right</v-icon>
														</v-btn>
													</v-col>
												</v-row>
												<v-row>
													<v-col cols="12" lg="6">
														<v-text-field dense id="whenCreated"
															:label="$t('attribute.ldap.whenCreated')"
															readonly v-model="usercopy.whenCreated"></v-text-field>
													</v-col>
													<v-col cols="12" lg="6">
														<v-text-field dense id="whenChanged"
															:label="$t('attribute.ldap.whenChanged')"
															readonly v-model="usercopy.whenChanged"></v-text-field>
													</v-col>
												</v-row>
												<v-row>
													<v-col cols="12" lg="6">
														<v-text-field dense id="lastLogon"
															:label="$t('attribute.ldap.lastLogon')"
															readonly v-model="usercopy.lastLogon"></v-text-field>
													</v-col>
													<v-col cols="12" lg="6">
														<v-text-field dense id="pwdLastSet"
															:label="$t('attribute.ldap.pwdLastSet')"
															readonly v-model="usercopy.pwdLastSet"></v-text-field>
													</v-col>
												</v-row>
												<v-row>
													<v-col cols="12" lg="8">
														<v-row justify="center">
															<span>
																{{ $t('attribute.ldap.objectClass') }}
															</span>
														</v-row>
														<v-row justify="center">
															<v-chip :light="$vuetify.theme.dark" :dark="!$vuetify.theme.dark"
																class="ma-1"
																v-for="i in usercopy.objectClass" :key="i"
																@click:close="removeObjectClassFromArray(i)"
																:close="editFlag == true">
																{{ i }}
															</v-chip>
														</v-row>
													</v-col>
													<v-col cols="12" lg="">
														<v-row class="ma-0 pa-0" justify="center">
															<v-autocomplete dense v-model="addObjectClass"
																:label="$t('actions.addObjectClass')" clearable
																:readonly="editFlag != true"
																:hint="$t('section.users.userDialog.hint.addObjectClass')"
																:items="objectClasses">
															</v-autocomplete>
															<v-btn color="primary" class="ml-3" :disabled="editFlag != true"
																@click="addObjectClassToArray" rounded icon>
																<v-icon>
																	mdi-plus
																</v-icon>
															</v-btn>
														</v-row>
													</v-col>
													<v-col cols="12" lg="12">
														<v-text-field dense id="objectCategory"
															:label="$t('attribute.ldap.objectCategory')" readonly
															v-model="usercopy.objectCategory"
															:rules="[this.fieldRules(usercopy.objectCategory, 'ldap_dn')]"></v-text-field>
													</v-col>
												</v-row>
											</v-expansion-panel-content>
										</v-expansion-panel>
									</v-expansion-panels>
								</v-row>

								<!-- DJANGO USER DATA -->
								<v-row align-content="center" class="mb-2" v-else>
									<v-col class="ma-0 pa-0" cols="12" md="6">
										<v-card outlined height="100%" class="ma-1 pa-4">
											<v-row :justify="this.$vuetify.breakpoint.smAndDown ? 'center' : 'start'"
												class="pa-0 ma-0 text-h6 mx-4 mb-5">
												{{ $t('section.users.basicDetails') }}
											</v-row>
											<v-row class="pa-0 ma-0 font-weight-medium">
												<v-col cols="12" lg="6">
													<v-text-field dense id="first_name"
														:label="$t('attribute.ldap.givenName')"
														:readonly="editFlag != true" v-model="usercopy.first_name"
														:rules="[this.fieldRules(usercopy.first_name, 'ge_name')]"></v-text-field>
												</v-col>
												<v-col cols="12" lg="6">
													<v-text-field dense id="last_name" :label="$t('attribute.ldap.sn')"
														:readonly="editFlag != true" v-model="usercopy.last_name"
														:rules="[this.fieldRules(usercopy.last_name, 'ge_name')]"></v-text-field>
												</v-col>
												<v-col cols="12" lg="6"
													:class="this.$vuetify.breakpoint.smAndUp ? 'mt-3' : ''">
													<v-text-field dense id="email" :label="$t('attribute.user.email')"
														:readonly="editFlag != true" v-model="usercopy.email"
														:rules="[this.fieldRules(usercopy.email, 'ge_mail')]"></v-text-field>
												</v-col>
												<v-col cols="12" lg="6">
													<v-fade-transition>
														<v-card v-ripple outlined class="pa-1 py-2">
															<span :color="(usercopy.is_enabled ? 'valid-40' : 'error')">
																{{ usercopy.is_enabled ? $t('attribute.user.is_enabled') :
																	$t('attribute.user.is_disabled') }}
															</span>
															<div elevation="0" v-if="usercopy.is_enabled == true">
																<v-icon color="valid-40">
																	mdi-check
																</v-icon>
															</div>
															<div elevation="0" icon rounded
																v-else-if="usercopy.is_enabled == false">
																<v-icon color="error">
																	mdi-close
																</v-icon>
															</div>
														</v-card>
													</v-fade-transition>
												</v-col>
												<v-col cols="12"
													v-if="user.last_login != undefined && user.last_login != ''">
													{{ $t('attribute.ldap.last_login') + ": " +
														truncateDate(user.last_login) }}
												</v-col>
											</v-row>
										</v-card>
									</v-col>
									<v-col class="ma-0 pa-0" cols="12" md="6">
										<v-card outlined height="100%" class="ma-1 pa-4">
											<v-row :justify="this.$vuetify.breakpoint.smAndDown ? 'center' : 'end'"
												class="pa-0 ma-0 text-h6 mx-4 mb-5">
												{{ $t('section.users.userDialog.extraDetails') }}
											</v-row>
											<v-row align-content="center" class="mb-2" v-if="!isLDAPView()">
												<v-row justify="center" no-gutters>
													<v-col cols="12" class="mb-1">
														<p style="cursor: default" class="ma-0 pa-0">
															{{ $t("attribute.user.user_type") }}
														</p>
													</v-col>
													<v-col cols="12">
														<v-chip color="primary">
															{{ user.user_type ? user.user_type.toUpperCase() : 'UNKNOWN' }}
														</v-chip>
													</v-col>
												</v-row>
												<v-row justify="center" no-gutters class="ma-4">
													<v-col cols="12" class="px-2" v-if="user.dn && user.dn.length > 0">
														<v-text-field dense id="dn"
															:label="$t('attribute.ldap.distinguishedName')"
															:value="user.dn" readonly></v-text-field>
													</v-col>
													<v-col cols="12" lg="6" class="px-2">
														<v-text-field dense id="dn" :label="$t('attribute.ldap.whenCreated')"
															:value="truncateDate(user.created_at)" readonly></v-text-field>
													</v-col>
													<v-col cols="12" lg="6" class="px-2">
														<v-text-field dense id="dn" :label="$t('attribute.ldap.whenChanged')"
															:value="truncateDate(user.modified_at)" readonly></v-text-field>
													</v-col>
												</v-row>
											</v-row>
										</v-card>
									</v-col>
								</v-row>
							</v-form>
						</v-card-text>
					</v-tab-item>

					<!-- PERMISSIONS SCREEN -->
					<v-tab-item :key="2">
						<UserPermissionList content-class="ma-0 pa-0 mx-2 pb-4" :permissions="this.permissions"
							enable-calculations @update="onClickPermission" :edit-flag="editFlag" />
					</v-tab-item>
				</v-tabs>
				<!-- End of Details Page -->
			</div>
		</v-expand-transition>

		<!-- Actions -->
		<v-card-actions class="card-actions">
			<v-row class="ma-1 pa-0" align="center" align-content="center"
				:justify="this.$vuetify.breakpoint.mdAndDown ? 'center' : 'space-between'">
				<v-menu top offset-y right nudge-top="3rem" :close-on-content-click="false"
					v-model="extraListOpen">
					<template v-slot:activator="{ on, attrs }">
						<v-btn v-bind="attrs" v-on="on" elevation="0"
							:disabled="!editFlag"
							style="min-width: 32px;" class="pa-0 px-4 pr-1 mx-1"
							color="primary" outlined>
							{{ $t("actions.moreActions") }}
							<v-icon id="filterListButton" :class="extraListOpen == true ? 'active' : ''">
								mdi-chevron-up
							</v-icon>
						</v-btn>
					</template>
					<v-list elevation="0" dense :dark="isThemeDark($vuetify)" :light="!isThemeDark($vuetify)">
						<v-list-item class="ma-0 pa-0 px-2" :disabled="!editFlag" @click="deleteTotp"
							:dark="isThemeDark($vuetify)" :light="!isThemeDark($vuetify)">
							<v-list-item-icon color="primary" class="mx-0 pa-0 mr-2">
								<v-icon> mdi-cellphone </v-icon>
							</v-list-item-icon>
							<v-list-item-content color="primary" class="v-list-btn v-btn">
								{{ $t("section.users.userDialog.deleteTotp").toUpperCase() }}
							</v-list-item-content>
						</v-list-item>

						<!-- Enable/Disable Buttons -->
						<v-list-item class="ma-0 pa-0 px-2" v-if="!usercopy.is_enabled"
							:disabled="!editFlag || isLoggedInUser(usercopy.username)"
							@click="setAccountStatus(true)"
							:dark="isThemeDark($vuetify)" :light="!isThemeDark($vuetify)">
							<v-list-item-icon class="mx-0 pa-0 mr-2">
								<v-icon color="valid">
									mdi-checkbox-marked-circle-outline
								</v-icon>
							</v-list-item-icon>
							<v-list-item-content class="v-list-btn v-btn">
								{{ $t("actions.enable").toUpperCase() }}
							</v-list-item-content>
						</v-list-item>
						<v-list-item class="ma-0 pa-0 px-2" v-else-if="usercopy.is_enabled == true"
							:disabled="!editFlag || isLoggedInUser(usercopy.username)"
							@click="setAccountStatus(false)" :dark="isThemeDark($vuetify)"
							:light="!isThemeDark($vuetify)">
							<v-list-item-icon class="mx-0 pa-0 mr-2">
								<v-icon color="red">
									mdi-close-circle-outline
								</v-icon>
							</v-list-item-icon>
							<v-list-item-content class="v-list-btn v-btn">
								{{ $t("actions.disable").toUpperCase() }}
							</v-list-item-content>
						</v-list-item>
					</v-list>
				</v-menu>
				<v-row align="center" :justify="this.$vuetify.breakpoint.smAndDown ? 'center' : 'end'"
					class="ma-0 pa-0">
					<!-- Edit User Button -->
					<v-btn color="primary" class="ma-0 pa-0 pa-4 ma-1" rounded v-if="editFlag != true"
						@click="editUser" :disabled="isLDAPUser() && !isLDAPView()">
						<v-icon class="mr-1">
							mdi-pencil
						</v-icon>
						{{ $t("actions.edit") }}
					</v-btn>
					<!-- View User Button -->
					<v-btn color="primary" class="ma-0 pa-0 pa-4 ma-1" rounded v-if="editFlag == true"
						@click="viewUser">
						<v-icon class="mr-1">
							mdi-eye
						</v-icon>
						{{ $t("actions.view") }}
					</v-btn>
					<!-- Save User Changes Button -->
					<v-btn @click="saveUser" :dark="!isThemeDark($vuetify) && editFlag && !loading"
						:light="isThemeDark($vuetify) && editFlag && !loading" class="ma-0 pa-0 pa-4 ma-1"
						rounded
						:disabled="!editFlag || loading">
						<v-icon class="mr-1">
							mdi-content-save
						</v-icon>
						{{ $t("actions.save") }}
					</v-btn>
					<!-- Save User Changes Button -->
					<v-btn @click="saveUser(true)" :dark="!isThemeDark($vuetify) && editFlag && !loading"
						:light="isThemeDark($vuetify) && editFlag && !loading" class='ma-0 pa-0 pa-4 ma-1'
						rounded
						:disabled="!editFlag || loading">
						<v-icon class="mr-1">
							mdi-exit-to-app
						</v-icon>
						{{ $t("actions.saveClose") }}
					</v-btn>
					<!-- Refresh User Button -->
					<refresh-button dense :fetching-data="fetchingData" :loading="refreshLoading"
						@refresh="refreshUser" />
				</v-row>
			</v-row>
		</v-card-actions>

		<!-- USER ADD TO GROUP DIALOG -->
		<v-dialog eager max-width="1200px" v-model="dialogs['userAddToGroup']">
			<CNObjectList :dialogKey="'userAddToGroup'" ref="UserAddToGroup" @addDNs="addToGroup"
				:excludeDNs="excludeGroups" :enableUsers="false" @closeDialog="closeInnerDialog" />
		</v-dialog>
	</v-card>
</template>

<script>
import User from '@/include/User.js';
import CNObjectList from '@/components/CNObjectList.vue';
import UserPermissionList from '@/components/User/UserPermissionList.vue';
import RefreshButton from '@/components/RefreshButton.vue';
import validationMixin from '@/plugins/mixin/validationMixin.js';
import utilsMixin from '@/plugins/mixin/utilsMixin.js';
import ldap_perm_json from '@/include/ldap_permissions.json';
import { notificationBus } from '@/main.js';
import { getDomainDetails, truncateDate } from '@/include/utils.js';
import LDAPObjectClasses from '@/include/constants/LDAPObjectClasses.js';
import { LDAPUserCategories } from '@/include/constants/LDAPUser.js';
import LDAPCountries from '@/include/constants/LDAPCountries.js';

export default {
	name: 'UserDialog',
	components: {
		CNObjectList,
		RefreshButton,
		UserPermissionList
	},
	data() {
		return {
			objectClasses: LDAPObjectClasses,
			categories: LDAPUserCategories,
			LDAPCountries: LDAPCountries,
			TABS: {
				GROUPS: 0,
				DEFAULT: 1,
				PERMS: 2,
			},
			showAlert: false,
			panel: [],
			loading: false,
			loadingColor: 'accent',
			extraListOpen: false,
			tab: () => { return this.TABS.DEFAULT },
			error: false,
			errorMsg: "",
			domain: "",
			realm: "",
			basedn: "",
			changingPerms: false,
			changingGroups: false,
			usercopy: {},
			addObjectClass: "",
			groupsToRemove: [],
			groupsToAdd: [],
			excludeGroups: [],
			// Dialog States
			dialogs: {
				userAddToGroup: false
			},
			permissions: ldap_perm_json.permissions,
		}
	},
	mixins: [validationMixin, utilsMixin],
	props: {
		dialogKey: String,
		editFlag: Boolean,
		user: Object,
		userClass: Function,
		fetchingData: Boolean,
		refreshLoading: Boolean,
		parentTitle: String,
	},
	created() {
		this.alertDelay = 0.5e3;
		this.syncUser();
	},
	computed: {
		enabledPermInts() {
			return this.calcEnabledPermissions(this.permissions)
		},
		getUSN() {
			return `${this.usercopy.username}@${this.domain}`
		},
	},
	watch: {
		'dialogs': {
			handler: function (v_new) {
				if (!v_new['userAddToGroup'] || v_new['userAddToGroup'] == false)
					this.$refs.UserAddToGroup.clearList();
			},
			deep: true
		},
	},
	methods: {
		truncateDate,
		isLDAPView() {
			return this.parentTitle == 'ldap-users'
		},
		isLDAPUser() {
			if ("user_type" in this.user)
				return this.user.user_type == "ldap"
			return true
		},
		getModifiedValues() {
			let v = []
			const IGNORE_KEYS = [
				'lastLogon'
			]
			for (const key in this.user) {
				if (IGNORE_KEYS.includes(key)) continue
				if (!(key in this.user) ||
					!(key in this.usercopy)) {
					continue
				}
				if (Array.isArray(this.user[key])) {
					// Compare Values for Partial Update
					let orig_list = structuredClone(this.user[key])
					orig_list.sort()
					this.usercopy[key].sort()
					if (JSON.stringify(orig_list) !== JSON.stringify(this.usercopy[key]))
						v.push(key)
				}
				else if (this.usercopy[key] != this.user[key]) {
					v.push(key)
				}
			}
			return v
		},
		getIsUserModified() {
			// Check Group Changes
			if (this.groupsToAdd.length > 0 || this.groupsToRemove.length > 0)
				return true
			//  Check Permissions Changes
			let p = []
			for (const [key] of Object.entries(this.permissions)) {
				if (this.permissions[key].value == true)
					p.push(key)
			}
			if (this.user.permission_list !== undefined)
				if (!this.arraysAreEqual(p, this.user.permission_list))
					return true
			// Check the rest of the user data.
			if (this.getModifiedValues().length > 0)
				return true
			return false
		},
		goToGroup(groupDn) {
			this.$emit('goToGroup', { distinguishedName: groupDn })
		},
		setupExclude() {
			this.excludeGroups = []
			if (this.usercopy.memberOfObjects != undefined && this.usercopy.memberOfObjects.length > 0) {
				this.usercopy.memberOfObjects.forEach(g => {
					this.excludeGroups.push(g.distinguishedName)
				});
			}
			if (this.usercopy.groupsToAdd != undefined && this.usercopy.groupsToAdd.length > 0) {
				this.usercopy.groupsToAdd.forEach(g => {
					if (!this.excludeGroups.includes(g))
						this.excludeGroups.push(g)
				});
			}
			return
		},
		openDialog(key) {
			this.dialogs[key] = true;
			switch (key) {
				case 'userAddToGroup':
					this.setupExclude()
					this.$refs.UserAddToGroup.fetchLists(this.excludeGroups)
					break;
				default:
					break;
			}
		},
		closeInnerDialog(key) {
			this.dialogs[key] = false;
		},
		addToGroup(groups) {
			this.groupsToAdd = groups.map(e => e.distinguishedName)
			if (!this.usercopy.memberOfObjects)
				this.usercopy.memberOfObjects = []
			groups.forEach(g => {
				if (this.usercopy.memberOfObjects.filter(e => e.distinguishedName == g.distinguishedName).length == 0) {
					this.usercopy.memberOfObjects.push(g)
				}

				if (this.groupsToRemove != undefined) {
					// console.log("MTR Includes this member, removing. " + g.distinguishedName)
					this.groupsToRemove = this.groupsToRemove.filter(e => e != g.distinguishedName)
				}
			});
			this.closeInnerDialog('userAddToGroup')
			// this.logGroups()
			this.setupExclude()
			this.$forceUpdate
		},
		removeFromGroup(groupDn) {
			let currentGroupFilter = this.usercopy.memberOfObjects.filter(e => e.distinguishedName == groupDn)
			let currentGroup
			if (currentGroupFilter.length > 0)
				currentGroup = currentGroupFilter[0]

			if (currentGroup['objectRid'] == this.usercopy['primaryGroupID']) {
				console.error("Primary group cannot be deleted")
			}
			else {
				if (!this.groupsToRemove.includes(groupDn))
					this.groupsToRemove.push(groupDn)

				if (this.groupsToAdd.includes(groupDn))
					this.groupsToAdd = this.groupsToAdd.filter(e => e != groupDn)

				if (this.excludeGroups.includes(groupDn))
					this.excludeGroups = this.excludeGroups.filter(e => e != groupDn)

				this.usercopy.memberOfObjects = this.usercopy.memberOfObjects.filter(e => e.distinguishedName != groupDn)
				// this.logGroups()
				this.setupExclude()
				this.$forceUpdate
			}
		},
		logGroups() {
			console.log("Groups to Add")
			console.log(this.groupsToAdd)
			console.log("Groups to Remove")
			console.log(this.groupsToRemove)
			console.log("Member Of Objects")
			console.log(this.usercopy.memberOfObjects)
		},
		copyText(textString) {
			navigator.clipboard.writeText(textString);
		},
		getNameForPID(item) {
			return item.name + " (" + item.objectRid + ")"
		},
		setDomainDetails() {
			let domainDetails = getDomainDetails()
			this.domain = domainDetails['name']
			this.realm = domainDetails['realm']
			this.basedn = domainDetails['basedn']
			this.userSelector = this.isLDAPUser() ? domainDetails['user_selector'] : 'username'
		},
		setObjectClassToArray() {
			if (this.usercopy.objectClass && this.usercopy.objectClass != '' && (typeof this.usercopy.objectClass === 'string' || this.usercopy.objectClass instanceof String)) {
				this.usercopy.objectClass = this.usercopy.objectClass.replace(/'/g, "\"")
				this.usercopy.objectClass = JSON.parse(this.usercopy.objectClass)
			}
		},
		removeObjectClassFromArray(value) {
			// Returns array without value
			if (this.usercopy.objectClass.includes(value) && Array.isArray(this.usercopy.objectClass))
				this.usercopy.objectClass = this.usercopy.objectClass.filter(e => e !== value);
			this.addObjectClass = value
		},
		addObjectClassToArray() {
			if (!this.usercopy.objectClass.includes(this.addObjectClass) && this.addObjectClass)
				this.usercopy.objectClass.push(this.addObjectClass);
			this.addObjectClass = ''
		},
		// When a permission in the v-list changes this function is executed
		onClickPermission(key) {
			if (this.editFlag == true)
				this.permissions[key].value = !this.permissions[key].value
		},
		goBackToDetails() {
			this.tab = this.TABS.DEFAULT
			this.changingPerms = false
			this.changingGroups = false
		},
		// This function sets the permissions each time the usercopy object is
		// synced to the parent view user object
		setPermissions() {
			for (const [key] of Object.entries(this.permissions)) {
				this.permissions[key].value = false
			}
			if (this.usercopy['permission_list'] != undefined) {
				this.usercopy['permission_list'].forEach(perm => {
					this.permissions[perm].value = true
				});
			}
		},
		delay(t, val) {
			return new Promise(resolve => setTimeout(resolve, t, val));
		},
		goToTargetTab(targetTab) {
			if (targetTab > Object.keys(this.TABS).length - 1) targetTab = 0
			if (targetTab < 0) targetTab = 2
			this.tab = targetTab
			switch (targetTab) {
				case this.TABS.GROUPS:
					this.changingPerms = false
					this.changingGroups = true
					break;
				case this.TABS.PERMS:
					this.changingPerms = true
					this.changingGroups = false
					break;
				default:
					this.changingPerms = false
					this.changingGroups = false
					break;
			}
		},
		refreshUserList() {
			this.$emit('refreshUserList');
		},
		async setAccountStatus(enabled) {
			this.extraListOpen = false
			let ident
			if (this.isLDAPUser())
				ident = {
					username: this.usercopy.username,
					enabled: enabled
				}
			else
				ident = {
					id: this.usercopy.id,
					enabled: enabled
				}
			await new this.userClass({}).changeAccountStatus(ident)
				.then(() => {
					let action = `words.${enabled ? 'enabled' : 'disabled'}`;
					this.refreshUser()
					this.refreshUserList()
					notificationBus.$emit('createNotification',
						{
							message: (`${this.$tc("classes.user", 1)} ${this.$t(action)}`).toUpperCase(),
							type: 'warning'
						}
					);
				})
				.catch(error => {
					console.error(error)
					notificationBus.$emit('createNotification',
						{
							message: this.getMessageForCode(error),
							type: 'error'
						}
					);
				})
		},
		async deleteTotp(closeDialog = false) {
			let ident
			if (this.isLDAPUser())
				ident = this.usercopy[this.userSelector]
			else
				ident = this.usercopy["username"]
			await new User({}).deleteTotp({ username: ident })
				.then(() => {
					if (closeDialog == true)
						this.closeDialog();
					else
						this.refreshUser();
					notificationBus.$emit('createNotification',
						{
							message: (this.$tc("classes.totp-device", 1) + " " + this.$t("words.deleted.m")).toUpperCase(),
							type: 'success'
						}
					);
					this.loading = false
					this.loadingColor = 'primary'
				})
				.catch(error => {
					console.error(error)
					this.loading = false
					this.loadingColor = 'error'
					this.error = true;
					this.errorMsg = this.getMessageForCode(error)
					notificationBus.$emit('createNotification',
						{ message: this.errorMsg.toUpperCase(), type: 'error' }
					)
				})
		},
		editUser() {
			this.showAlert = false
			this.$emit('editToggle', true);
			setTimeout(() => {
				this.setShowAlert()
			}, this.alertDelay)
		},
		viewUser() {
			this.showAlert = false
			this.$emit('editToggle', false);
			this.refreshUser();
			setTimeout(() => {
				this.setShowAlert()
			}, this.alertDelay)
		},
		closeDialog() {
			this.$emit('closeDialog', this.dialogKey);
		},
		async saveUser(closeDialog = false) {
			if (this.getIsUserModified() != true) {
				console.log("User was not modified, ignoring user save request.")
				return
			}
			switch (this.parentTitle) {
				case "django-users":
					if (this.$refs.userForm.validate()) {
						await new this.userClass({}).update(this.usercopy)
							.then(() => {
								if (closeDialog == true)
									this.closeDialog();
								else
									this.refreshUser();
								this.$emit('save');
								this.loading = false
								this.loadingColor = 'primary'
							})
							.catch(error => {
								console.error(error)
								this.loading = false
								this.loadingColor = 'error'
								this.error = true;
								this.errorMsg = this.getMessageForCode(error)
								notificationBus.$emit('createNotification',
									{ message: this.errorMsg.toUpperCase(), type: 'error' }
								)
							})
					} else {
						this.loading = false
						this.loadingColor = 'error'
						this.error = true;
					}
					break;
				default:
					this.loading = true
					this.loadingColor = 'primary'
					// Set permissions array properly
					this.usercopy.permission_list = []
					for (const [key] of Object.entries(this.permissions)) {
						if (this.permissions[key].value == true)
							this.usercopy.permission_list.push(key)
					}

					let modifiedValues = this.getModifiedValues()
					let partialUpdateData = {
						distinguishedName: this.usercopy.distinguishedName,
					}
					partialUpdateData[this.userSelector] = this.usercopy['username']
					partialUpdateData[this.userSelector] = this.usercopy[this.userSelector]
					modifiedValues.forEach(k => {
						partialUpdateData[k] = this.usercopy[k]
					})
					if (this.groupsToAdd.length > 0)
						partialUpdateData.groupsToAdd = this.groupsToAdd
					else
						delete partialUpdateData.groupsToAdd
					// Groups to Remove
					if (this.groupsToRemove.length > 0)
						partialUpdateData.groupsToRemove = this.groupsToRemove
					else
						delete partialUpdateData.groupsToRemove

					// Uncomment below to debug permissions list
					// console.log(this.usercopy.permission_list)
					if (this.$refs.userForm.validate()) {
						await new this.userClass({}).update(partialUpdateData)
							.then(() => {
								if (closeDialog == true)
									this.closeDialog();
								else
									this.refreshUser();
								this.$emit('save');
								this.loading = false
								this.loadingColor = 'primary'
							})
							.catch(error => {
								console.error(error)
								this.loading = false
								this.loadingColor = 'error'
								this.error = true;
								this.errorMsg = this.getMessageForCode(error)
								notificationBus.$emit('createNotification',
									{ message: this.errorMsg.toUpperCase(), type: 'error' }
								)
							})
					} else {
						this.loading = false
						this.loadingColor = 'error'
						this.error = true;
					}
					break;
			}
		},
		isLoggedInUser(username) {
			if (username == localStorage.getItem('user.username'))
				return true
			return false
		},

		setUserGroups() {
			this.groupsToRemove = []
			this.groupsToAdd = []
		},
		setShowAlert() {
			if (this.isLDAPUser() && this.isLDAPView() || !this.isLDAPUser() && !this.isLDAPView())
				this.showAlert = true
		},
		// Sync the usercopy object to the parent view user object on the
		// next tick to avoid mutation errors
		syncUser() {
			this.tab = this.TABS.DEFAULT
			this.changingPerms = false
			this.changingGroups = false
			this.excludeGroups = []
			this.setDomainDetails()
			this.usercopy = new this.userClass({})
			this.extraListOpen = false
			this.$nextTick(() => {
				this.usercopy = Object.assign({}, this.user)
				this.setUserGroups()
				this.setObjectClassToArray()
				this.setupExclude()
				if (this.usercopy.lastLogon == 0)
					this.usercopy.lastLogon = this.$t('section.users.userDialog.noLastLogon')
				this.setPermissions()
				this.loading = false
				this.loadingColor = 'primary'
				if (Object.keys(this.user).length != 0)
					setTimeout(() => {
						this.setShowAlert()
					}, this.alertDelay)
			})
		},
		// Tells the parent view to refresh/fetch the user again
		async refreshUser() {
			this.loading = true
			this.$emit('refreshUser', this.user);
			this.setupExclude()
			this.loading = false
			this.loadingColor = 'primary'
		},
		exit() {
			this.showAlert = false
			this.tab = this.TABS.DEFAULT
		}
	}
}
</script>
