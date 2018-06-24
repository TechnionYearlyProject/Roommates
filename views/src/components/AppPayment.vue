<template>
    <v-layout row warp pt-0>
      <v-flex xs12 sm12 md6 offset-md3 :class="{'my-5': $vuetify.breakpoint.mdAndUp}">
        <v-card>
          <v-alert :type="alert.type" :value="alert.show" transition="scale-transition">
          {{ alert.message }}
          </v-alert>
          <v-card grid-list-lg style="min-height: 300px">
            <v-layout justify-center>
              <h3 style="margin-bottom: 20px">One step from Closing The Deal!</h3>
            </v-layout>
            <v-card-actions>
              <v-layout justify-center>
                <v-dialog v-model="ToSDialog" fullscreen hide-overlay transition="dialog-bottom-transition" style="margin-left: 50px">
                  <v-btn slot="activator" color="primary" dark style="padding-left: 10px; padding-right: 10px">Terms of Service</v-btn>
                  <v-card>
                    <v-toolbar dark color="primary">
                      <v-btn icon dark @click.native="ToSDialog = false">
                        <v-icon>close</v-icon>
                      </v-btn>
                      <v-toolbar-title>Terms of Service</v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-toolbar-items>
                        <v-btn dark flat @click.native="ToSClick">Agree</v-btn>
                      </v-toolbar-items>
                    </v-toolbar>
                    <v-card>
                      <v-card-text>
                        <div><span class="title">1. Introduction</span><br> These Website Standard Terms And Conditions (these “Terms” or these “Website Standard Terms And Conditions”) contained herein on this webpage, shall govern your use of this website, including all pages within this website (collectively referred to herein below as this “Website”). These Terms apply in full force and effect to your use of this Website and by using this Website, you expressly accept all terms and conditions contained herein in full. You must not use this Website, if you have any objection to any of these Website Standard Terms And Conditions.
                        </div>
                        <div> <br> </div>
                        <div><span class="title">2. Intellectual Property Rights.</span><br> Other than content you own, which you may have opted to include on this Website, under these Terms, Roommates and/or its licensors own all rights to the intellectual property and material contained in this Website, and all such rights are reserved.
                          You are granted a limited license only, subject to the restrictions provided in these Terms, for purposes of viewing the material contained on this Website
                        </div>
                        <div> <br> </div>
                        <div><span class="title">3. Restrictions</span><br> You are expressly and emphatically restricted from all of the following:<br>
                          publishing any Website material in any media;<br>
                          selling, sublicensing and/or otherwise commercializing any Website material;<br>
                          publicly performing and/or showing any Website material;<br>
                          using this Website in any way that is, or may be, damaging to this Website;<br>
                          using this Website in any way that impacts user access to this Website;<br>
                          using this Website contrary to applicable laws and regulations, or in a way that causes, or may cause, harm to the Website, or to any person or business entity;<br>
                          engaging in any data mining, data harvesting, data extracting or any other similar activity in relation to this Website, or while using this Website;<br>
                          using this Website to engage in any advertising or marketing;<br>
                          Certain areas of this Website are restricted from access by you and Roommates may further restrict access by you to any areas of this Website, at any time, in its sole and absolute discretion.  Any user ID and password you may have for this Website are confidential and you must maintain confidentiality of such information.</div>
                        <div> <br> </div>
                        <div><span class="title">4. No warranties.</span><br>This Website is provided “as is,” with all faults, and Roommates makes no express or implied representations or warranties, of any kind related to this Website or the materials contained on this Website. Additionally, nothing contained on this Website shall be construed as providing consult or advice to you.
                        </div>
                      </v-card-text>
                    </v-card>


                  </v-card>
                </v-dialog>
                <v-spacer/>
                <v-dialog v-model="contractDialog" fullscreen hide-overlay transition="dialog-bottom-transition" style="margin-right: 40px">
                  <v-btn slot="activator" color="primary" dark>Apartment Contract</v-btn>
                  <v-card>
                    <v-toolbar dark color="primary">
                      <v-btn icon dark @click.native="contractDialog = false">
                        <v-icon>close</v-icon>
                      </v-btn>
                      <v-toolbar-title>Contract</v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-toolbar-items>
                        <v-btn dark flat @click.native="contractDialog = false">Agree</v-btn>
                      </v-toolbar-items>
                    </v-toolbar>
                    <v-layout justify-center>
                      <v-container>
                        <br>
                        <div id="contract" class="DCS">
                          <div id="outputPage">
                            <div class="outputVersion2">
                              <div style="background:url('//www.lawdepot.com/common/images//draft_text.png') repeat-y center top/contain #fff;"><div class=" outputDocument residentialLease outputDocument">
                                <p style="line-height:17.0pt;font-size:12.0pt;line-height:18.0pt;font-family:Times New Roman;color:#000000;text-align:Center;margin-top:-9.0pt;"><span style="font-style:normal;font-weight:bold;">RESIDENTIAL LEASE AGREEMENT</span>
                                </p>
                                <p style="line-height:17.0pt;font-size:12.0pt;line-height:18.0pt;font-family:Times New Roman;color:#000000;text-align:Left;">THIS LEASE (the "Lease") dated this 24th day of June, 2018
                                </p>
                                <p style="line-height:17.0pt;font-size:12.0pt;line-height:18.0pt;font-family:Times New Roman;color:#000000;text-align:Left;">BETWEEN:
                                </p>
                                <p style="line-height:17.0pt;font-size:12.0pt;line-height:18.0pt;font-family:Times New Roman;color:#000000;text-align:Center;margin-top:25.0pt;"><span style="font-style:normal;font-weight:bold;">_________________________</span>
                                </p>
                                <p style="line-height:17.0pt;font-size:12.0pt;line-height:18.0pt;font-family:Times New Roman;color:#000000;text-align:Center;">(the "Landlord")
                                </p>
                                <p style="line-height:17.0pt;font-size:12.0pt;line-height:18.0pt;font-family:Times New Roman;color:#000000;text-align:Center;">- AND-
                                </p>
                                <p style="line-height:17.0pt;font-size:12.0pt;line-height:18.0pt;font-family:Times New Roman;color:#000000;text-align:Center;margin-top:18.0pt;"><span style="font-style:normal;font-weight:bold;">_________________________</span>
                                </p>
                                <p style="line-height:17.0pt;font-size:12.0pt;line-height:18.0pt;font-family:Times New Roman;color:#000000;text-align:Center;">(the "Tenant")
                                </p>
                                <p style="line-height:17.0pt;font-size:12.0pt;line-height:18.0pt;font-family:Times New Roman;color:#000000;text-align:Center;">(individually the “Party” and collectively the “Parties”)
                                </p>
                                <p style="line-height:17.0pt;font-size:12.0pt;line-height:18.0pt;font-family:Times New Roman;color:#000000;text-align:Left;margin-top:48.0pt;">IN CONSIDERATION OF the Landlord leasing certain premises to the Tenant and other valuable consideration, the receipt and sufficiency of which consideration is hereby acknowledged, the Parties agree as follows:
                                </p>
                                <ol start="1" style="line-height:17.0pt;font-size:12.0pt;line-height:18.0pt;font-family:Times New Roman;color:#000000;margin-top:10.0pt;list-style:decimal inside;">
                                  <li class="lhl" style="line-height:18.0pt;text-align:Left;margin-top:15.0pt;margin-bottom:6.0pt;list-style:none;"><span style="font-size:14.0pt;line-height:21.0pt;font-family:Helvetica;">Leased Property</span><span style="color:#000000;"><br></span>
                                  </li>
                                  <li style="margin-bottom:6.0pt;" value="1">
                                    <div style="margin-top:-17.0pt;padding-left:30.0pt;">The Landlord agrees to rent to the Tenant the apartment, municipally described as ______________________, ______________________, Alabama &nbsp;__________ (the "Property"), for use as residential premises only. &nbsp;<span style="color:#000000;"><br></span>
                                    </div>
                                  </li>
                                  <li style="margin-bottom:6.0pt;" value="2">
                                    <div style="margin-top:-17.0pt;padding-left:30.0pt;">No guests of the Tenants may occupy the Property for longer than one week without the prior written consent of the Landlord.<span style="color:#000000;"><br></span>
                                    </div>
                                  </li>
                                  <li style="margin-bottom:6.0pt;" value="3">
                                    <div style="margin-top:-17.0pt;padding-left:30.0pt;">No animals are allowed to be kept in or about the Property without the revocable written permission of the Landlord.<span style="color:#000000;"><br></span>
                                    </div>
                                  </li>
                                  <li style="margin-bottom:6.0pt;" value="4">
                                    <div style="margin-top:-17.0pt;padding-left:30.0pt;">Subject to the provisions of this Lease, the Tenant is entitled to the use of parking on or about the Property.<span style="color:#000000;"><br></span>
                                    </div>
                                  </li>
                                  <li style="margin-bottom:6.0pt;" value="5">
                                    <div style="margin-top:-17.0pt;padding-left:30.0pt;">The Tenant and members of Tenant's household will not smoke anywhere in the Property nor permit any guests or visitors to smoke in the Property.<span style="color:#000000;"><br></span>
                                    </div>
                                  </li>
                                  <li class="lhl" style="line-height:18.0pt;text-align:Left;margin-top:15.0pt;margin-bottom:6.0pt;list-style:none;"><span style="font-size:14.0pt;line-height:21.0pt;font-family:Helvetica;">Term</span><span style="color:#000000;"><br></span>
                                  </li>
                                  <li style="margin-bottom:6.0pt;" value="6">
                                    <div style="margin-top:-17.0pt;padding-left:30.0pt;">The term of the Lease commences at 12:00 noon on June 24, 2018 and ends at 12:00 noon on June 24, 2018.<span style="color:#000000;"><br></span>
                                    </div>
                                  </li>
                                  <li class="lhl" style="line-height:18.0pt;text-align:Left;margin-top:15.0pt;margin-bottom:6.0pt;list-style:none;"><span style="font-size:14.0pt;line-height:21.0pt;font-family:Helvetica;">Rent</span><span style="color:#000000;"><br></span>
                                  </li>
                                  <li style="margin-bottom:6.0pt;" value="7">
                                    <div style="margin-top:-17.0pt;padding-left:30.0pt;">Subject to the provisions of this Lease, the rent for the Property is $___________ per month (the "Rent").<span style="color:#000000;"><br></span>
                                    </div>
                                  </li>
                                  <li style="margin-bottom:6.0pt;" value="8">
                                    <div style="margin-top:-17.0pt;padding-left:30.0pt;">The Tenant will pay the Rent on or before the ____________________ of each and every month of the term of this Lease to the Landlord at ______________________, ______________, &nbsp;__________ or at such other place as the Landlord may later designate by cash or check.<span style="color:#000000;"><br></span>
                                    </div>
                                  </li>
                                  <li class="lhl" style="line-height:18.0pt;text-align:Left;margin-top:15.0pt;margin-bottom:6.0pt;list-style:none;"><span style="font-size:14.0pt;line-height:21.0pt;font-family:Helvetica;">Tenant Improvements</span><span style="color:#000000;"><br></span>
                                  </li>
                                  <li style="margin-bottom:6.0pt;" value="9">
                                    <div style="margin-top:-17.0pt;padding-left:30.0pt;">The Tenant will obtain written permission from the Landlord before doing any of the following: <span style="color:#000000;"><br></span>
                                      <ol start="1" style="margin-left:9.0pt;margin-top:1.0pt;list-style:lower-alpha inside;">
                                        <li style="margin-bottom:6.0pt;" value="1">
                                          <div style="margin-top:-17.0pt;padding-left:20.0pt;">applying adhesive materials, or inserting nails or hooks in walls or ceilings other than two small picture hooks per wall;<span style="color:#000000;"><br></span>
                                          </div>
                                        </li>
                                        <li style="margin-bottom:6.0pt;" value="2">
                                          <div style="margin-top:-17.0pt;padding-left:20.0pt;">painting, wallpapering, redecorating or in any way significantly altering the appearance of the Property;<span style="color:#000000;"><br></span>
                                          </div>
                                        </li>
                                        <li style="margin-bottom:6.0pt;" value="3">
                                          <div style="margin-top:-17.0pt;padding-left:20.0pt;">removing or adding walls, or performing any structural alterations;<span style="color:#000000;"><br></span>
                                          </div>
                                        </li>
                                        <li style="margin-bottom:6.0pt;" value="4">
                                          <div style="margin-top:-17.0pt;padding-left:20.0pt;">installing a waterbed(s);<span style="color:#000000;"><br></span>
                                          </div>
                                        </li>
                                        <li style="margin-bottom:6.0pt;" value="5">
                                          <div style="margin-top:-17.0pt;padding-left:20.0pt;">changing the amount of heat or power normally used on the Property as well as installing additional electrical wiring or heating units;<span style="color:#000000;"><br></span>
                                          </div>
                                        </li>
                                        <li style="margin-bottom:6.0pt;" value="6">
                                          <div style="margin-top:-17.0pt;padding-left:20.0pt;">placing or exposing or allowing to be placed or exposed anywhere inside or outside the Property any placard, notice or sign for advertising or any other purpose; or<span style="color:#000000;"><br></span>
                                          </div>
                                        </li>
                                        <li style="margin-bottom:0.0pt;" value="7">
                                          <div style="margin-top:-17.0pt;padding-left:20.0pt;">affixing to or erecting upon or near the Property any radio or TV antenna or tower.<span style="color:#000000;"><br></span>
                                          </div>
                                        </li>
                                      </ol>
                                    </div>
                                  </li>
                                  <li class="lhl" style="line-height:18.0pt;text-align:Left;margin-top:15.0pt;margin-bottom:6.0pt;list-style:none;"><span style="font-size:14.0pt;line-height:21.0pt;font-family:Helvetica;">Insurance</span><span style="color:#000000;"><br></span>
                                  </li>
                                  <li style="margin-bottom:6.0pt;" value="10">
                                    <div style="margin-top:-17.0pt;padding-left:30.0pt;">The Tenant is hereby advised and understands that the personal property of the Tenant is not insured by the Landlord for either damage or loss, and the Landlord assumes no liability for any such loss.<span style="color:#000000;"><br></span>
                                    </div>
                                  </li>
                                  <li class="lhl" style="line-height:18.0pt;text-align:Left;margin-top:15.0pt;margin-bottom:6.0pt;list-style:none;"><span style="font-size:14.0pt;line-height:21.0pt;font-family:Helvetica;">Attorney Fees</span><span style="color:#000000;"><br></span>
                                  </li>
                                  <li style="margin-bottom:6.0pt;" value="11">
                                    <div style="margin-top:-17.0pt;padding-left:30.0pt;">In the event that any action is filed in relation to this Lease, the unsuccessful Party in the action will pay to the successful Party, in addition to all the sums that either Party may be called on to pay, a reasonable sum for the successful Party's attorney fees.<span style="color:#000000;"><br></span>
                                    </div>
                                  </li>
                                  <li class="lhl" style="line-height:18.0pt;text-align:Left;margin-top:15.0pt;margin-bottom:6.0pt;list-style:none;"><span style="font-size:14.0pt;line-height:21.0pt;font-family:Helvetica;">Governing Law</span><span style="color:#000000;"><br></span>
                                  </li>
                                  <li style="margin-bottom:6.0pt;" value="12">
                                    <div style="margin-top:-17.0pt;padding-left:30.0pt;">This Lease will be construed in accordance with and exclusively governed by the laws of the State of Alabama.<span style="color:#000000;"><br></span>
                                    </div>
                                  </li>
                                  <li class="lhl" style="line-height:18.0pt;text-align:Left;margin-top:15.0pt;margin-bottom:6.0pt;list-style:none;"><span style="font-size:14.0pt;line-height:21.0pt;font-family:Helvetica;">Severability</span><span style="color:#000000;"><br></span>
                                  </li>
                                  <li style="margin-bottom:6.0pt;" value="13">
                                    <div style="margin-top:-17.0pt;padding-left:30.0pt;">If there is a conflict between any provision of this Lease and the Act, the Act will prevail and such provisions of the Lease will be amended or deleted as necessary in order to comply with the Act. Further, any provisions that are required by the Act are incorporated into this Lease.<span style="color:#000000;"><br></span>
                                    </div>
                                  </li>
                                  <li style="margin-bottom:6.0pt;" value="14">
                                    <div style="margin-top:-17.0pt;padding-left:30.0pt;">The invalidity or unenforceability of any provisions of this Lease will not affect the validity or enforceability of any other provision of this Lease. &nbsp;Such other provisions remain in full force and effect.<span style="color:#000000;"><br></span>
                                    </div>
                                  </li>
                                  <li class="lhl" style="line-height:18.0pt;text-align:Left;margin-top:15.0pt;margin-bottom:6.0pt;list-style:none;"><span style="font-size:14.0pt;line-height:21.0pt;font-family:Helvetica;">Amendment of Lease</span><span style="color:#000000;"><br></span>
                                  </li>
                                  <li style="margin-bottom:6.0pt;" value="15">
                                    <div style="margin-top:-17.0pt;padding-left:30.0pt;">This Lease may only be amended or modified by a written document executed by the Parties.<span style="color:#000000;"><br></span>
                                    </div>
                                  </li>
                                  <li class="lhl" style="line-height:18.0pt;text-align:Left;margin-top:15.0pt;margin-bottom:6.0pt;list-style:none;"><span style="font-size:14.0pt;line-height:21.0pt;font-family:Helvetica;">Assignment and Subletting</span><span style="color:#000000;"><br></span>
                                  </li>
                                  <li style="margin-bottom:6.0pt;" value="16">
                                    <div style="margin-top:-17.0pt;padding-left:30.0pt;">The Tenant will not assign this Lease, or sublet or grant any concession or license to use the Property or any part of the Property. Any assignment, subletting, concession, or license, whether by operation of law or otherwise, will be void and will, at Landlord's option, terminate this Lease.<span style="color:#000000;"><br></span>
                                    </div>
                                  </li>
                                  <li class="lhl" style="line-height:18.0pt;text-align:Left;margin-top:15.0pt;margin-bottom:6.0pt;list-style:none;"><span style="font-size:14.0pt;line-height:21.0pt;font-family:Helvetica;">Damage to Property</span><span style="color:#000000;"><br></span>
                                  </li>
                                  <li style="margin-bottom:6.0pt;" value="17">
                                    <div style="margin-top:-17.0pt;padding-left:30.0pt;">If the Property should be damaged other than by the Tenant's negligence or willful act or that of the Tenant's employee, family, agent, or visitor and the Landlord decides not to rebuild or repair the Property, the Landlord may end this Lease by giving appropriate notice.<span style="color:#000000;"><br></span>
                                    </div>
                                  </li>
                                  <li class="lhl" style="line-height:18.0pt;text-align:Left;margin-top:15.0pt;margin-bottom:6.0pt;list-style:none;"><span style="font-size:14.0pt;line-height:21.0pt;font-family:Helvetica;">Care and Use of Property</span><span style="color:#000000;"><br></span>
                                  </li>
                                  <li style="margin-bottom:6.0pt;" value="18">
                                    <div style="margin-top:-17.0pt;padding-left:30.0pt;">The Tenant will promptly notify the Landlord of any damage, or of any situation that may significantly interfere with the normal use of the Property or to any furnishings supplied by the Landlord.<span style="color:#000000;"><br></span>
                                    </div>
                                  </li>
                                  <li style="margin-bottom:6.0pt;" value="19">
                                    <div style="margin-top:-17.0pt;padding-left:30.0pt;">The Tenant will not engage in any illegal trade or activity on or about the Property.<span style="color:#000000;"><br></span>
                                    </div>
                                  </li>
                                  <li style="margin-bottom:6.0pt;" value="20">
                                    <div style="margin-top:-17.0pt;padding-left:30.0pt;">The Parties will comply with standards of health, sanitation, fire, housing and safety as required by law.<span style="color:#000000;"><br></span>
                                    </div>
                                  </li>
                                  <li style="margin-bottom:6.0pt;" value="21">
                                    <div style="margin-top:-17.0pt;padding-left:30.0pt;">The Parties will use reasonable efforts to maintain the Property in such a condition as to prevent the accumulation of moisture and the growth of mold. The Tenant will promptly notify the Landlord in writing of any moisture accumulation that occurs or of any visible evidence of mold discovered by the Tenant. The Landlord will promptly respond to any such written notices from the Tenant.<span style="color:#000000;"><br></span>
                                    </div>
                                  </li>
                                  <li style="margin-bottom:6.0pt;" value="22">
                                    <div style="margin-top:-17.0pt;padding-left:30.0pt;">If the Tenant is absent from the Property and the Property is unoccupied for a period of 4 consecutive days or longer, the Tenant will arrange for regular inspection by a competent person. The Landlord will be notified in advance as to the name, address and phone number of the person doing the inspections.<span style="color:#000000;"><br></span>
                                    </div>
                                  </li>
                                  <li style="margin-bottom:6.0pt;" value="23">
                                    <div style="margin-top:-17.0pt;padding-left:30.0pt;">At the expiration of the term of this Lease, the Tenant will quit and surrender the Property in as good a state and condition as they were at the commencement of this Lease, reasonable use and wear and tear excepted.<span style="color:#000000;"><br></span>
                                    </div>
                                  </li>
                                  <li class="lhl" style="line-height:18.0pt;text-align:Left;margin-top:15.0pt;margin-bottom:6.0pt;list-style:none;"><span style="font-size:14.0pt;line-height:21.0pt;font-family:Helvetica;">Rules and Regulations</span><span style="color:#000000;"><br></span>
                                  </li>
                                  <li style="margin-bottom:6.0pt;" value="24">
                                    <div style="margin-top:-17.0pt;padding-left:30.0pt;">The Tenant will obey all rules and regulations of the Landlord regarding the Property.<span style="color:#000000;"><br></span>
                                    </div>
                                  </li>
                                  <li class="lhl" style="line-height:18.0pt;text-align:Left;margin-top:15.0pt;margin-bottom:6.0pt;list-style:none;"><span style="font-size:14.0pt;line-height:21.0pt;font-family:Helvetica;">Lead Warning</span><span style="color:#000000;"><br></span>
                                  </li>
                                  <li style="margin-bottom:6.0pt;" value="25">
                                    <div style="margin-top:-17.0pt;padding-left:30.0pt;">Housing built before 1978 may contain lead based paint. Lead from paint, paint chips, and dust can pose health hazards if not taken care of properly. Lead exposure is especially harmful to young children and pregnant women. Before renting pre-1978 housing, lessors must disclose the presence of known lead-based paint hazards in the dwelling. &nbsp;<span style="font-style:normal;font-weight:bold;">Lessees must also receive a federally approved pamphlet on lead poisoning prevention.</span><span style="color:#000000;"><br></span>
                                    </div>
                                  </li>
                                  <li class="lhl" style="line-height:18.0pt;text-align:Left;margin-top:15.0pt;margin-bottom:6.0pt;list-style:none;"><span style="font-size:14.0pt;line-height:21.0pt;font-family:Helvetica;">Address for Notice</span><span style="color:#000000;"><br></span>
                                  </li>
                                  <li style="margin-bottom:6.0pt;" value="26">
                                    <div style="margin-top:-17.0pt;padding-left:30.0pt;">For any matter relating to this tenancy, the Tenant may be contacted at the Property or through the phone number below:<span style="color:#000000;"><br></span>
                                      <ol start="1" style="margin-left:9.0pt;margin-top:1.0pt;list-style:lower-alpha inside;">
                                        <li style="margin-bottom:6.0pt;" value="1">
                                          <div style="margin-top:-17.0pt;padding-left:20.0pt;">Name: _________________________<span style="color:#000000;"><br></span>
                                          </div>
                                        </li>
                                        <li style="margin-bottom:0.0pt;" value="2">
                                          <div style="margin-top:-17.0pt;padding-left:20.0pt;">Phone: &nbsp;_________________________<span style="color:#000000;"><br></span>
                                          </div>
                                        </li>
                                      </ol>
                                    </div>
                                  </li>
                                  <li style="margin-bottom:6.0pt;" value="27">
                                    <div style="margin-top:-17.0pt;padding-left:30.0pt;">For any matter relating to this tenancy, whether during or after this tenancy has been terminated, the Landlord's address for notice is:<span style="color:#000000;"><br></span>
                                      <ol start="1" style="margin-left:9.0pt;margin-top:1.0pt;list-style:lower-alpha inside;">
                                        <li style="margin-bottom:6.0pt;" value="1">
                                          <div style="margin-top:-17.0pt;padding-left:20.0pt;">Name: _________________________<span style="color:#000000;"><br></span>
                                          </div>
                                        </li>
                                        <li style="margin-bottom:6.0pt;" value="2">
                                          <div style="margin-top:-17.0pt;padding-left:20.0pt;">Address: ______________________, ______________, &nbsp;__________<span style="color:#000000;"><br></span>
                                            <p style="text-align:Left;">The contact information for the Landlord is:
                                            </p>
                                          </div>
                                        </li>
                                        <li style="margin-bottom:0.0pt;" value="3">
                                          <div style="margin-top:-17.0pt;padding-left:20.0pt;">Phone: &nbsp;_________________________<span style="color:#000000;"><br></span>
                                          </div>
                                        </li>
                                      </ol>
                                    </div>
                                  </li>
                                  <li class="lhl" style="line-height:18.0pt;text-align:Left;margin-top:15.0pt;margin-bottom:6.0pt;list-style:none;"><span style="font-size:14.0pt;line-height:21.0pt;font-family:Helvetica;">General Provisions</span><span style="color:#000000;"><br></span>
                                  </li>
                                  <li style="margin-bottom:6.0pt;" value="28">
                                    <div style="margin-top:-17.0pt;padding-left:30.0pt;">All monetary amounts stated or referred to in this Lease are based in the United States dollar.<span style="color:#000000;"><br></span>
                                    </div>
                                  </li>
                                  <li style="margin-bottom:6.0pt;" value="29">
                                    <div style="margin-top:-17.0pt;padding-left:30.0pt;">Any waiver by the Landlord of any failure by the Tenant to perform or observe the provisions of this Lease will not operate as a waiver of the Landlord's rights under this Lease in respect of any subsequent defaults, breaches or non-performance and will not defeat or affect in any way the Landlord's rights in respect of any subsequent default or breach.<span style="color:#000000;"><br></span>
                                    </div>
                                  </li>
                                  <li style="margin-bottom:6.0pt;" value="30">
                                    <div style="margin-top:-17.0pt;padding-left:30.0pt;">This Lease will extend to and be binding upon and inure to the benefit of the respective heirs, executors, administrators, successors and assigns, as the case may be, of each Party. All covenants are to be construed as conditions of this Lease.<span style="color:#000000;"><br></span>
                                    </div>
                                  </li>
                                  <li style="margin-bottom:6.0pt;" value="31">
                                    <div style="margin-top:-17.0pt;padding-left:30.0pt;">All sums payable by the Tenant to the Landlord pursuant to any provision of this Lease will be deemed to be additional rent and will be recovered by the Landlord as rental arrears.<span style="color:#000000;"><br></span>
                                    </div>
                                  </li>
                                  <li style="margin-bottom:6.0pt;" value="32">
                                    <div style="margin-top:-17.0pt;padding-left:30.0pt;">Where there is more than one Tenant executing this Lease, all Tenants are jointly and severally liable for each other's acts, omissions and liabilities pursuant to this Lease.<span style="color:#000000;"><br></span>
                                    </div>
                                  </li>
                                  <li style="margin-bottom:6.0pt;" value="33">
                                    <div style="margin-top:-17.0pt;padding-left:30.0pt;">Locks may not be added or changed without the prior written agreement of both Parties, or unless the changes are made in compliance with the Act.<span style="color:#000000;"><br></span>
                                    </div>
                                  </li>
                                  <li style="margin-bottom:6.0pt;" value="34">
                                    <div style="margin-top:-17.0pt;padding-left:30.0pt;">The Tenant will be charged an additional amount of $25.00 for each N.S.F. check or checks returned by the Tenant's financial institution.<span style="color:#000000;"><br></span>
                                    </div>
                                  </li>
                                  <li style="margin-bottom:6.0pt;" value="35">
                                    <div style="margin-top:-17.0pt;padding-left:30.0pt;">Headings are inserted for the convenience of the Parties only and are not to be considered when interpreting this Lease. Words in the singular mean and include the plural and vice versa. Words in the masculine mean and include the feminine and vice versa.<span style="color:#000000;"><br></span>
                                    </div>
                                  </li>
                                  <li style="margin-bottom:6.0pt;" value="36">
                                    <div style="margin-top:-17.0pt;padding-left:30.0pt;">This Lease may be executed in counterparts. Facsimile signatures are binding and are considered to be original signatures.<span style="color:#000000;"><br></span>
                                    </div>
                                  </li>
                                  <li style="margin-bottom:6.0pt;" value="37">
                                    <div style="margin-top:-17.0pt;padding-left:30.0pt;">This Lease constitutes the entire agreement between the Parties.<span style="color:#000000;"><br></span>
                                    </div>
                                  </li>
                                  <li style="margin-bottom:6.0pt;" value="38">
                                    <div style="margin-top:-17.0pt;padding-left:30.0pt;">During the last 30 days of this Lease, the Landlord or the Landlord's agents will have the privilege of displaying the usual 'For Sale' or 'For Rent' or 'Vacancy' signs on the Property.<span style="color:#000000;"><br></span>
                                    </div>
                                  </li>
                                  <li style="margin-bottom:0.0pt;" value="39">
                                    <div style="margin-top:-17.0pt;padding-left:30.0pt;">Time is of the essence in this Lease.<span style="color:#000000;"><br></span>
                                    </div>
                                  </li>
                                </ol><div class=" keepTogether">
                                <p style="line-height:17.0pt;font-size:12.0pt;line-height:18.0pt;font-family:Times New Roman;color:#000000;text-align:Left;margin-top:35.0pt;">IN WITNESS WHEREOF _________________________ and _________________________ have duly affixed their signatures on this 24th day of June, 2018.
                                </p><div>
                                <table style="line-height:17.0pt;margin-left:auto;margin-right:auto;margin-top:23.0pt;width:100%;border-collapse:separate;border-spacing:0pt;"><colgroup><col style="width:50%;"><col style="width:50%;"></colgroup><tbody>
                                <tr>
                                  <td style="text-align:Right;vertical-align:Bottom;padding:16.0pt;width:50%;">&nbsp;
                                  </td>
                                  <td style="text-align:Left;vertical-align:Bottom;padding:16.0pt;width:50%;">
                                    <p style="font-size:12.0pt;line-height:18.0pt;font-family:Times New Roman;color:#000000;text-align:Left;">_______________________________<br>______________________(Landlord)<br>
                                    </p>
                                  </td>
                                </tr>
                                <tr>
                                  <td style="text-align:Right;vertical-align:Bottom;padding:16.0pt;width:50%;">&nbsp;
                                  </td>
                                  <td style="text-align:Left;vertical-align:Bottom;padding:16.0pt;width:50%;">
                                    <p style="font-size:12.0pt;line-height:18.0pt;font-family:Times New Roman;color:#000000;text-align:Left;">_______________________________<br>______________________(Tenant)<br>
                                    </p>
                                  </td>
                                </tr></tbody>
                                </table></div>
                                <table style="line-height:16.0pt;margin-right:auto;margin-top:24.0pt;width:100%;border-collapse:separate;border-spacing:0pt;"><colgroup><col style="width:48.97959%;"><col style="width:2.040817%;"><col style="width:48.97959%;"></colgroup><tbody>
                                <tr>
                                </tr></tbody>
                                </table></div><div class=" keepTogether">
                                <p style="line-height:17.0pt;font-size:12.0pt;line-height:18.0pt;font-family:Times New Roman;color:#000000;text-align:Left;margin-top:35.0pt;">The Tenant acknowledges receiving a duplicate copy of this Lease signed by the Tenant and the Landlord on the _____ day of ______________________, 20____.
                                </p><div>
                                <table style="line-height:17.0pt;margin-left:auto;margin-right:auto;margin-top:23.0pt;width:100%;border-collapse:separate;border-spacing:0pt;"><colgroup><col style="width:50%;"><col style="width:50%;"></colgroup><tbody>
                                <tr>
                                  <td style="text-align:Right;vertical-align:Bottom;padding:16.0pt;width:50%;">&nbsp;
                                  </td>
                                  <td style="text-align:Left;vertical-align:Bottom;padding:16.0pt;width:50%;">
                                    <p style="font-size:12.0pt;line-height:18.0pt;font-family:Times New Roman;color:#000000;text-align:Left;">_______________________________<br>______________________(Tenant)<br>
                                    </p>
                                  </td>
                                </tr></tbody>
                                </table></div></div></div></div><div class="LDCopyright">
                              <p>©2002-2018 LawDepot.com®</p>
                            </div>
                            </div>
                          </div>
                        </div>
                      </v-container>
                    </v-layout>

                  </v-card>
                </v-dialog>
              </v-layout>
            </v-card-actions>
          </v-card>

          <v-container>
            <v-layout justify-center >
              <v-card>
                  <app-paypal :amount="amount" @completed="paymentSuccess"></app-paypal>
              </v-card>
            </v-layout>
          </v-container>
         </v-card>
      </v-flex>
    </v-layout>
</template>

<script>
import AppPaypal from './sub-components/AppPayPal';
import AppApartmentAd from './AppApartmentAd';

export default {
  name: 'AppPayment',
  props: {
    price: {
      type: Number,
      required: false
    }
  },
  url: '',
  agreedToS: false,
  data() {
    return {
      amount: 100,
      ToSDialog: false,
      contractDialog: false,
      fetchedPublisher: false,
      publisher: {
        firstName: 'Some',
        lastName: 'User',
        email: 'user@example.com',
        mobilePhone: '+972-8711111'
      },
      alert: {
        show: false,
        message: '',
        type: 'error'
      },
      apartment: [
        {
          _id: '5b154565bfc2730600d892c3',
          _createdBy: '',
          createdAt: Date.now(),
          price: 1000,
          entranceDate: new Date('12-29-2019').getTime(),
          location: {
            address: {
              state: 'israel',
              city: 'Tel-Aviv',
              street: 'Rothschild',
              number: 23
            },
            geolocation: [34.775313, 32.065887]
          },
          numberOfRooms: 3,
          floor: 1,
          totalFloors: 5,
          tags: [0, 7],
          requiredRoommates: 1,
          totalRoommates: 2,
          groups: []
        }
      ]
    };
  },
  methods: {
    paymentSuccess(payment) {
      if (payment.state === 'approved') {
        if (this.agreedToS === true) {
          if (this.agreedContract === true) {
            alert(`success!\nID: ${payment.id}`); // eslint-disable-line
            // redirect to group page where the user status will be changed to payed
          } else {
            this.alert.message = 'please read and agree to the Apartment Contract';
            this.alert.show = true;
          }
        } else {
          this.alert.message = 'please read and agree to the Terms of Service';
          this.alert.show = true;
        }
      } else {
        this.alert.message = 'payment not complete';
        this.alert.show = true;
      }
    },
    ToSClick() {
      this.ToSDialog = false;
      this.agreedToS = true;
    },
    getPublisher() {
      if (!this.fetchedPublisher) {
        const id = this.apartment._createdBy;
        this.$store.dispatch('fetchUser', { id })
        .then((users) => {
          if (users[id]) {
            this.publisher = users[id];
          } else {
            this.publisher = {
              firstName: 'Some',
              lastName: 'User',
              email: 'user@example.com',
              mobilePhone: '+972-8711111'
            };
          }
          this.fetchedPublisher = true;
        });
      }
    },
    visitPage() {
      this.$router.push({
        name: 'AppApartmentPage',
        params: {
          id: this.apartment._id,
          apartment: this.apartment,
          publisher: this.publisher
        }
      });
    }
  },
  components: {
    AppPaypal,
    AppApartmentAd
  }
};
</script>

<style scoped>
</style>
