
class QuestionsController < ApplicationController

    skip_before_action :verify_authenticity_token, only: [:update]

    def index
        @room = Room.find_by name: params[:room_id]
        @questions = @room.questions
        render :json => @questions.to_json
    end

    def show
        @question = Question.find(params[:id])
        render :json => @question.to_json(:include => [
            :question_responses
        ])
    end

    def create
        @room = Room.find_by name: params[:room_id]
        puts "THE ROOM IS: " + @room.name
        if @room == nil
            return
        end

        puts "CREATING QUESTION"

        @question = Question.create(
            name: params[:question_name], 
            room_id: @room.id,
            description: '')

        puts "CREATED QUESTION: " + @question.id.to_s

        render :json => @question.to_json(:include => [
            :question_responses
        ])
    end

    def update
        
        puts "======================="
        puts params[:question].inspect
        puts params[:response].inspect
        puts "======================="

        @question = Question.find(params[:id])
        @question.description = params[:question][:description]
        @question.save

        # This is a pretty dubm implementation... but for the scale of this.
        # i dont really care - its quick enough
        # loop through each response for the question and update each one.
        params[:response].each do |index, response|
            puts response.inspect
            
            row = QuestionResponse.new
            if !response[:id].blank?
                row = QuestionResponse.find(response[:id])
            end

            if response[:delete] == "true"
                row.destroy
            else
                row.description = response[:description]
                row.question_id = @question.id
                row.save
            end
        end

        render :json => @question.to_json(:include => [
            :question_responses
        ])
    end

end
