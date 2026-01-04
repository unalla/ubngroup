/*!
* Start Bootstrap - Creative v7.0.6 (https://startbootstrap.com/theme/creative)
* Copyright 2013-2022 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-creative/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // Activate SimpleLightbox plugin for portfolio items
    new SimpleLightbox({
        elements: '#portfolio a.portfolio-box'
    });    
});

function submitToAPI(e) {
       e.preventDefault();       
       var name = $("#name").val();
       var phone = $("#phone").val();
       var email = $("#email").val();
       var desc = $("#message").val();
       var data = {
          name : name,
          phone : phone,
          email : email,
          desc : desc
        };

       $.ajax({
         type: "POST",
         url : "https://867c416d61.execute-api.us-east-1.amazonaws.com/final/submit",
         dataType: "json",
         crossDomain: "true",
         contentType: "application/json; charset=utf-8",
         data: JSON.stringify(data),

         
         success: function () {
           // clear form and show a success message
           alert("Successfull");
           document.getElementById("contact-form").reset();
       location.reload();
         },
         error: function () {
           // show an error message
           alert("UnSuccessfull");
         }});
     }

    const visitorCount = fetch(' https://867c416d61.execute-api.us-east-1.amazonaws.com/final/visitors', {
                            method: 'GET',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(response =>  response.json())
                        .then(count => {           
                            return count
                        });      
   
        
    const visitors = async() => {
        document.getElementById("visitor").innerHTML =  await visitorCount;
    }
           
    function toggleChat() {
        const chatContainer = document.getElementById("chat-container");
        const toggleBtn = document.getElementById("chat-toggle-btn");
    
        if (chatContainer.style.display === "none") {
            chatContainer.style.display = "block";
            toggleBtn.innerText = "Close"; // Change button text when open
            toggleBtn.style.background = "#6c757d"; // Optional: change color to gray
        } else {
            chatContainer.style.display = "none";
            toggleBtn.innerText = "Chat";
            toggleBtn.style.background = "#007BFF"; // Reset to original blue
        }
    } 