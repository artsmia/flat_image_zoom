var zoomerTemplate = _.template("

<% if (type == 'video') {%>
    <div id='<%= id %>' class='zoomer video'>
        <div class='video-container'>
            <video id='<%= player_id %>' poster='<%= video_poster %>' src='<%= video_src %>' type='video/mp4' controls='controls'></video>
        </div>
        <div class='hidden slide-article'><article class='info'><%= text %></article></div>
        <ul class='hidden meta'>
            <li class='title'><%= title %></li>
            <li class='artist'><%= artist %></li>
            <li class='year'><%= year %></li>
        </ul>
    </div>
<% } %>
<% if (type == 'zoomer') {%>
    <div class='zoomer <%= zoomer_class %>'>
        <div class='hidden slide-article'><article class='info'><%= text %></article></div>
        <ul class='hidden meta'>
            <li class='title'><%= title %></li>
            <li class='artist'><%= artist %></li>
            <li class='year'><%= year %></li>
        </ul>
    </div>
<% } %>

");