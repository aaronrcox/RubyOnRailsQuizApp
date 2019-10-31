
class PagesController < ApplicationController

   
    def index
        if current_user
            redirect_to presenter_url and return
        end
    end

    # VIEW FOR PRESENTER DASHBOARD
    def presenter
        if current_user == nil
            redirect_to root_url
        end

        @rooms = current_user.rooms
    end

    # VIEW FOR GUEST ROOM DASHBOARD
    def room
        if session[:guest_name]
            @room_name = params[:room_name]
            @guest_name = session[:guest_name]
        else
            redirect_to root_url
        end
    end


    # JOIN ROOM FORM SUBMIT
    def join_room
        session[:guest_name] = params[:guest_name]
        redirect_to '/room/' + params[:room_name]
    end
    
end

