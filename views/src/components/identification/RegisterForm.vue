<template>
    <form>
        <div class="form-row">
            <input type="email"
                   class="form-control"
                   id="inputEmail"
                   placeholder="email"
                   v-model.lazy="email">
        </div>
        <div class="form-row">
            <input type="password"
                   class="form-control"
                   id="inputPassword"
                   placeholder="Password"
                   v-model.lazy="password">
        </div>
        <div class="form-row">
            <input type="text"
                   class="form-control"
                   id="inputFirstName"
                   placeholder="First Name"
                   v-model.lazy="firstName">
        </div>
        <div class="form-row">
            <input type="text"
                   class="form-control"
                   id="inputLastName"
                   placeholder="Last Name"
                   v-model.lazy="lastName">
        </div>
        <div class="form-row">
            <div class="form-group col-md-4" style="padding-left:0;">
                <input class="form-control"
                       id="birthday-day-select"
                       placeholder="day"
                       v-model.lazy="birthDateDay">
            </div>
            <div class="form-group col-md-4" style="padding-left:0;">
                <input class="form-control"
                       id="birthday-month-select"
                       placeholder="Month"
                       v-model.lazy="birthDateMonth">
            </div>
            <div class="form-group col-md-4" style="padding-right:0;padding-left:0;">
                <input class="form-control"
                       id="birthday-year-select"
                       placeholder="Year"
                       v-model.lazy="birthDateYear">
            </div>
        </div>
        <div class="form-row">
            <div class="form-check form-check-inline">
                <label class="form-check-label pr-4 pb-1 pl-2">Gender</label>
                <input class="form-check-input mr-1"
                       type="radio"
                       name="inlineRadioOptions"
                       id="genderMale"
                       value="male"
                       v-model.lazy="gender">
                <span class=" pb-1">male</span>
                <input class="form-check-input ml-3"
                       type="radio"
                       name="inlineRadioOptions"
                       id="genderFemale"
                       value="female"
                       v-model.lazy="gender">
                <span class=" pb-1">female</span>
            </div>
        </div>
        {{ email }}
        <button type="submit" class="btn btn-warning">Register !</button>

    </form>
</template>

<script>
    export default {
        name: 'register-form',
        data() {
            return {
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                gender: '',
                birthDateDay: '',
                birthDateMonth: '',
                birthDateYear: ''
            };
        }
    };
</script>

<style scoped>
    .form-row,
    .form-group {
        margin: 4px 0 4px 0;
    }
</style>
