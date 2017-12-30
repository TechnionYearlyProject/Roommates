<template>
<div class="container mb-5" style="text-align:center">
    <a href="#" class="s-btn-add-apartment" data-toggle="tooltip" title="Add an Ad!">+</a> 
</div>
</template>

<script>
export default {};
</script>

<style>

.s-btn-add-apartment:link,
.s-btn-add-apartment:visited {
  padding: 8px 80px;
  font-size: 150%;
  cursor: pointer;
  border-radius: 10px;
  text-decoration: none;
  background-color: #333;
  color: #f1c40f;
  transition: background-color 0.5s, border 0.5s, color 0.5s;
}

.s-btn-add-apartment:hover,
.s-btn-add-apartment:active {
  background-color: #f1c40f;
  color: #333;
}
</style>