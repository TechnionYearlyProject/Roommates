<template>
<div>
  <div class="row">
    <div class="col-md-12">
      <h2 class="s-h2">step {{ progression }}</h2>
    </div>
  </div>
  <div class="row">
		<div class="col-md-12">
  		<div class="progress" style="margin-top:20px; margin-bottom:20px;">
        <div :class="{ one: true, 'bg-success': (progression*25 >= 25), 'no-color':(progression*25 < 25) }"></div>
        <div :class="{ two: true, 'bg-success': (progression*25 >= 50), 'no-color':(progression*25 < 50) }"></div>
        <div :class="{ three: true, 'bg-success': (progression*25 >= 75), 'no-color':(progression*25 < 75) }"></div>
  			<div class="progress-bar bg-success" :style="{ width: (progression * 25) + '%' }"></div>
		  </div>
	  </div>
  </div>
</div>
</template>

<script>
export default {
  props: ['progression']
}
</script>

<style scoped>
.one,
.two,
.three {
  position: absolute;
  margin-top: -10px;
  z-index: 1;
  height: 40px;
  width: 40px;
  border-radius: 25px;
}

.one {
  left: 25%;
}

.two {
  left: 48%;
}

.three {
  left: 72%;
}

.no-color {
  background-color: inherit;
}

.bg-success {
  transition: all .5s ease;
}
</style>
