class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  def self.publishes_updates
    publisher = LiveModel::Publisher.new
    
    self.after_update do 
      publisher.publish(self)
    end

    define_singleton_method :on_update do |&block|
      publisher.subscribe(&block)
    end
  end
end
