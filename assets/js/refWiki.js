$(function(){
    // Controlador de páginas já carregadas
    var wikiLoads = {};
    var divWiki = $("#divWikipedia");
    var hoverDivWiki = false;
    var hoverRefWiki = false;
    
    // Obtendo titulo da página com texto correspondente para API
    function pagesWiki(name){
        name_lower = name.toLowerCase().replaceAll(/\s/g,'');
        switch(name_lower){
            case 'php':
                return 'PHP';
            case 'java':
                return 'Java_(linguagem_de_programação)';
            case 'craiz':
                return 'C_(linguagem_de_programação)';
            case 'pascal':
                return 'Pascal_(linguagem_de_programação)';
            default: return name;
        }
    }
    
    // Funcao para mostrar infos do Wikipedia
    function popupWiki(e, page){
        divWiki.css({display: 'none', opacity: 0});
        
        if(page.loading == false)
        {
            divWiki.children("h6").text(page.wikipedia.title);
            var infoWiki = divWiki.children("div");
            infoWiki.html(page.wikipedia.extract);
            var pFirst = infoWiki.children("p").first();
            if(pFirst.text() == null || pFirst.text() == "")
                pFirst.remove();
            if(infoWiki.children().length > 1)
                infoWiki.children("p:not(:first-child)").remove();
            divWiki.children("span").html("Fonte: <a target='_blank' href='https://pt.wikipedia.org/wiki/"+page.wikipedia.title+"'>Wikipédia Brasil</a>");
            
            // Limit width page
            const widthPopup = $("#divWikipedia").outerWidth(true) + 10;
            const maxLeft = $(document).width();
            var leftPopup = $(e.target).offset().left;
            if (widthPopup + leftPopup > maxLeft) {
                leftPopup = maxLeft / 2;
                leftPopup -= widthPopup / 2;
            }

            // Limit height page
            const heightPopup = $("#divWikipedia").outerHeight(true) + 10;

            var topPopup = 0;
            if (heightPopup > $(e.target).offset().top) {
                topPopup = heightPopup + 20;
            } else {
                topPopup = $(e.target).offset().top - heightPopup ;
            }

            // Position popup
            divWiki.css({left: leftPopup, top: topPopup});

            setTimeout(function(){
                if(hoverDivWiki || hoverRefWiki)
                    divWiki.css({display: 'block', opacity: 1});
            }, 200);
        }
        else
        {
            divWiki.children("h6").text("Carregando...");
            divWiki.children("div").html("<p></p>");
            divWiki.children("span").html("");
            
            // Limit width page
            const widthPopup = $("#divWikipedia").outerWidth(true) + 10;
            const maxLeft = $(document).width();
            var leftPopup = $(e.target).offset().left;
            if (widthPopup + leftPopup > maxLeft) {
                leftPopup = maxLeft / 2;
                leftPopup -= widthPopup / 2;
            }

            // Limit height page
            const heightPopup = $("#divWikipedia").outerHeight(true) + 10;
            var topPopup = 0;
            if (heightPopup > $(e.target).offset().top) {
                topPopup = heightPopup + 20;
            } else {
                topPopup = $(e.target).offset().top - heightPopup ;
            }

            // Position popup
            divWiki.css({left: leftPopup, top: topPopup});
            // Show popup
            divWiki.css({display: 'block', opacity: 1});
        }
        
        divWiki.css({display: 'block', opacity: 1});
    }
    
    // Funcao interativa
    function wiki(e){
        console.log(e);
            var pageToLoad = pagesWiki($(e.target).text());
            if(pageToLoad != null)
            {
                if(pageToLoad in wikiLoads == false)
                {
                    var url = "https://pt.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&titles="+pageToLoad+"&formatversion=2&exsectionformat=plain&origin=*&exchars=355";
                    wikiLoads[pageToLoad] = {
                        url: url,
                        loading: true,
                        wikipedia: null
                    };


                    axios.get(url, {
                        headers: { 
                          'Content-Type' : 'application/json; charset=UTF-8'
                        },
                    }).then(res => {
                        wikiLoads[pageToLoad].wikipedia = res.data.query.pages[0];
                        wikiLoads[pageToLoad].loading = false;
                        popupWiki(e, wikiLoads[pageToLoad]);
                    }).catch(err => console.error('wiki', err));
                }
                
                popupWiki(e, wikiLoads[pageToLoad]);
            }
    }
    
    // Hover nas infos do Wikipedia
    $("#divWikipedia").hover(
        // Enter
        function(e){
            hoverDivWiki = true;
        },
        // Leave
        function(e){
            hoverDivWiki = false;
            setTimeout(function(){
                if(!hoverDivWiki && !hoverRefWiki)
                    divWiki.css({display: 'none', opacity: 0});
            }, 200);
        }
    );
    
    // Hover no texto
    $(".refWikipedia").hover(
        // Enter
        function(e){
            hoverRefWiki = true;
            setTimeout(function(){
                if(hoverDivWiki || hoverRefWiki)
                    wiki(e);
            }, 200);
    },
        // Leave
        function(e){
            hoverRefWiki = false;
            setTimeout(function(){
                if(!hoverDivWiki && !hoverRefWiki)
                    divWiki.css({display: 'none', opacity: 0});
            }, 200);
        });

});