<template>
    <footer class="footer">
      <div class="footer-container">
        <!-- Logo & About -->
        <div class="footer-section">
          <h2 class="logo">ANGELS HEIGHT</h2>
          <p>...Healthcare Training Per Excellence is Our Concern.</p>
        </div>
  
        <!-- Quick Links -->
        <div class="footer-section">
          <h3>Quick Links</h3>
          <!-- <ul>
            <li><nuxt-link to="/" class="routerMove"><i class="fa fa-home"></i>Home</nuxt-link></li>
            <li><nuxt-link to="/About" class="routerMove"><i class="fa fa-user"></i>About Us</nuxt-link></li>
            <li><nuxt-link to="/Notifications" class="routerMove"><i class="fa fa-bell"></i>Notifications</nuxt-link></li>
            <li><nuxt-link to="/Support" class="routerMove"><i class="fa fa-heart"></i>Support</nuxt-link></li>
          </ul> -->
        </div>
  
        <!-- Support & Help -->
        <div class="footer-section">
          <h3>Support</h3>
          <ul>
            <li><a href="tel:09032327228">09032327228</a></li>
            <li><a href="tel:08107812435">08107812435</a></li>
            <li><a href="tel:09053347772">09053347772</a></li>
          </ul>
        </div>
  
        <!-- Social Media -->
        <div class="footer-section">
          <h3>Follow Us</h3>
          <div class="social-links">
            <a href="#"><i class="fa fa-facebook"></i></a>
            <a href="#"><i class="fa fa-twitter"></i></a>
            <a href="#"><i class="fa fa-instagram"></i></a>
          </div>
        </div>
      </div>
      <!-- Copyright -->
      <div class="footer-bottom">
        <p>&copy; {{ new Date().getFullYear() }} Angelsheight. All rights reserved.</p>
        <p><a href="mailto:info@angelsheight.org">info@angelsheight.org</a></p>
        <p>Designed by <a href="https://abtech-two.vercel.app">ABTech</a></p>
      </div>
    </footer>
  </template>
  
  <style scoped>
  .footer {
    background: #222;
    color: white;
    padding: 50px 20px;
    text-align: center;
  }
  
  .footer-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 40px;
    max-width: 1200px;
    margin: auto;
  }
  .footer-bottom a{
    color: white;
  }
  
  .footer-section {
    max-width: 250px;
  }
  
  .logo {
    font-size: 1.8rem;
    font-weight: bold;
  }
  
  h3 {
    font-size: 1.2rem;
    margin-bottom: 10px;
  }
  
  p, ul {
    font-size: 0.9rem;
    color: #ccc;
  }
  
  ul {
    list-style: none;
    padding: 0;
  }
  
  ul li {
    margin: 5px 0;
  }
  
  ul li a {
    color: #bbb;
    text-decoration: none;
    transition: color 0.3s ease;
  }
  
  ul li a:hover {
    color: #fff;
  }
  
  .social-links {
    display: flex;
    gap: 15px;
    justify-content: center;
  }
  
  .social-links a {
    font-size: 1.4rem;
    color: white;
    transition: color 0.3s ease;
  }
  
  .social-links a:hover {
    color: #007bff;
  }
  
  .footer-bottom {
    margin-top: 30px;
    font-size: 0.9rem;
    color: #aaa;
  }
  .routerMove{
    display: flex;
    gap: 5px;
  }
  </style>
  