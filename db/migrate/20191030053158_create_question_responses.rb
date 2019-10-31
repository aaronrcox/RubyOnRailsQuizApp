class CreateQuestionResponses < ActiveRecord::Migration[6.0]
  def change
    create_table :question_responses do |t|
      t.string :description
      t.integer :question_id
      t.timestamps
    end
  end
end
