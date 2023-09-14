$(function(){
    // vars 
    const url_posts = "api/posts";

    // Request to get posts
    axios.get(url_posts, {
        headers: { 
          'Content-Type' : 'application/json; charset=UTF-8'
        },
    }).then(res => {
       console.log('res', res);
    }).catch(err => console.error('get_posts', err));

    // Open post to learn more
    $(".post-learn-more").on('click', function(){
        const post_id = $(this).data('post-id');
        
        $("html").animate({scrollTop:0}, 300, 'swing', function() { 
            $("#post-modal-content").css('display', 'block');
            window.animateCSS('#post-modal-content', 'slideInUp').then((message) => {
                $('.post-body').scrollTop(0); // scroll to begin post body
                $('.post-body').position().top; // focus
            });
        }); 
    });

    // Close post
    $("#post-close").on('click', function(){
        window.animateCSS('#post-modal-content', 'slideOutDown').then((message) => {
            $("#post-modal-content").css('display', 'none');
        });
    });

});