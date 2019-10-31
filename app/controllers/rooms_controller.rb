
class RoomsController < ApplicationController

    def show
        @current_user = current_user
        @room = Room.find_by name: params[:id]
        if @room == nil
            redirect_to '/' and return
        end

        @questions = @room.questions
    end

    def create
        room = Room.new(
            name: params[:room_name], 
            user_id: current_user.id,
            status: 'OPEN')

        room.save
        redirect_to '/presenter'
    end

end
