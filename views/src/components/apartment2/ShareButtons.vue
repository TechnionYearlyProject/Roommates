
<template>
 	<b-container class="box">
            <b-container id="share-buttons">
            	<b-row>
            		<b-col>
            			<!-- Email -->
					    <b-link :href="'mailto:?Subject=' + this.subject + '&amp;Body=' + this.body + ' ' +  this.pageLink" v-b-popover.hover.top="'Share it via an Email!'">
					        <img src="https://simplesharebuttons.com/images/somacro/email.png" alt="Email" />
					    </b-link>
			 		</b-col>
			 		<b-col>
			    		<!-- Facebook -->
			    		<b-link :href="'http://www.facebook.com/sharer.php?u=' + this.pageLink" target="_blank"
			    		v-b-popover.hover.top="'Share it on Facebook!'">
			        		<img src="https://simplesharebuttons.com/images/somacro/facebook.png" alt="Facebook" />
			    		</b-link>
			    	</b-col>
			 		<b-col>
			    		<!-- Google+ -->
			    		<b-link :href="'https://plus.google.com/share?url=' + this.pageLink" target="_blank"
			    		v-b-popover.hover.top="'Share it on Google+'">
			       		 	<img src="https://simplesharebuttons.com/images/somacro/google.png" alt="Google" />
			    		</b-link>
					</b-col>
			 		<b-col>
			    		<!-- Print -->
			    		<a href="javascript:;" onclick="window.print()"
			    		v-b-popover.hover.top="'Print it!'">
			        		<img src="https://simplesharebuttons.com/images/somacro/print.png" alt="Print" />
			    		</a>
			   		 </b-col>		
			    </b-row>
			</b-container>
	</b-container>
</template>

<script>
    import bContainer from 'bootstrap-vue/es/components/layout/container'
    import bCard from 'bootstrap-vue/es/components/card/card';
    import EventBus from "../../event-bus/EventBus";
    
export default {
    data() {
      return {
        pageLink: "",
        subject: "Look at this ad at Roommates!",
        body: "Look what I've found on Roommates:",
      };
    },
    async created() {
    	this.pageLink = document.URL;
    }
}
</script>



<style scoped>
	.box {
    	padding: 20px 0;
    	border-style: none;
    	background-color:transparent;
  	}

	#share-buttons img {
		width: 35px;
		padding: 5px;
		border: 0;
		box-shadow: 0;
	}
</style>