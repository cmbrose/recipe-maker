class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  def self.publishes_updates
    publishers = {}
    
    self.after_update do 
      publishers[self.id]&.publish(self)
    end

    define_singleton_method :on_update do |id, &block|
      if publishers[id].nil?
        publishers[id] = LiveModel::Publisher.new
      end

      publishers[id].subscribe(&block)
    end
  end
end
