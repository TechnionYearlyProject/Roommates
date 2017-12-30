<template>
<form>
  <div class="form-row">
    <label for="inputEmail">Email</label>
    <input type="email" class="form-control" id="inputEmail" placeholder="">
  </div>
  <div class="form-row">
    <label for="inputPassword">Password</label>
    <input type="password" class="form-control" id="inputPassword" placeholder="">
  </div>
  <div class="form-row">
    <div class="form-group col-md-6">
        <label for="inputFirstName">First Name</label>
        <input type="text" class="form-control" id="inputFirstName" placeholder="">
    </div>
    <div class="form-group col-md-6">
      <label for="inputLastName">Last Name</label>
      <input type="text" class="form-control" id="inputLastName" placeholder="">
    </div>
  </div>
  <div class="form-row">
    <div class="form-check form-check-inline">
      <label class="form-check-label pr-4 pb-1 pl-2" for="genderMale genderFemale">Gender</label>
      <input class="form-check-input mr-1" 
        type="radio" 
        name="inlineRadioOptions"
        id="genderMale" 
        value="male">
        <span class=" pb-1">male</span>
      <input class="form-check-input ml-3"
        type="radio"
        name="inlineRadioOptions"
        id="genderFemale"
        value="female">
        <span class=" pb-1">female</span>
    </div>
  </div>
  <button type="submit" class="btn btn-warning">Register</button>
</form>
</template>

<script>
export default {};
</script>

<style>

</style>
