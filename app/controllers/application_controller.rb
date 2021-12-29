class ApplicationController < ActionController::Base
  private

  def parse_boolean(value)
    ActiveRecord::Type::Boolean.new.deserialize(value)
  end
end
