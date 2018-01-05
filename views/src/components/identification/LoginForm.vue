<template>
    <form>
        <div class="form-group">
            <label for="inputEmail">Email</label>
            <input type="text"
                   class="form-control"
                   id="inputEmail"
                   placeholder="email"
                   v-model.lazy="email">
        </div>
        <div class="form-group">
            <label for="inputPassword">Password</label>
            <input type="password"
                   class="form-control"
                   id="inputPassword"
                   placeholder="Password"
                   v-model.lazy="password"
            >
        </div>
        <button type="submit" class="btn btn-warning">Login</button>
    </form>

</template>

<script>
    export default {
        name: 'login-form',
        data() {
            return {
                email: '',
                password: ''
            };
        }
    };
</script>

<style>
    .form-group {
        margin: 4px 0 4px 0;
    }
</style>
