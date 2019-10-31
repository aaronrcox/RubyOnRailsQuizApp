class Room < ApplicationRecord
    belongs_to :user
    has_many :questions
    validates_uniqueness_of :name
end
