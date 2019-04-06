<template lang="pug">
nav#topnav.navbar.navbar-dark.bg-primary.navbar-expand-lg
  .container
    // Brand
    router-link.navbar-brand.mr-auto(:to="{ name: 'dashboard' }")
      | Vitumob | Shipping Only

    .dropdown.user-profile-access
      // User profile image
      a.avatar.avatar-sm.avatar-online.dropdown-toggle#userProfileOptionsAccess(
        href="#1"
        role='button',
        data-toggle='dropdown',
        aria-haspopup='true',
        aria-expanded='true'
      )
        img.avatar-img.rounded-circle(v-bind:src='userProfilePic', alt='...')

      // Menu
      .dropdown-menu.dropdown-menu-right(aria-labelledby="userProfileOptionsAccess")
        span.username.dropdown-item.text-muted {{ user.displayName }}
        //- router-link.dropdown-item(to="{ name: 'userAccountInfo' }") Profile
        //- router-link.dropdown-item(to="{ name: 'userAccountSettings' }") Settings
        hr.dropdown-divider
        a.dropdown-item(@click="signOutUser") Logout
</template>

<script>
/* eslint-disable prettier/prettier */
export default {
  name: 'NavigationBar',
  computed: {
    userProfilePic() {
      return this.user.photoURL || 'https://res.cloudinary.com/shipping-only/image/upload/v1544705265/unknown.png';
    },
  },
};
</script>
