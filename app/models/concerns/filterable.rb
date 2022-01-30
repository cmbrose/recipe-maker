module Filterable
  extend ActiveSupport::Concern

  module ClassMethods
    def filter(filtering_params)
      results = where(nil)
      filtering_params.each do |key, value|
        results = results.public_send("filter_by_#{key}", value) if value.present?
      end
      results
    end

    def fiter_types
      methods.grep(/^filter_by_/).map do |name|
        name.to_s.remove('filter_by_').to_sym
      end
    end
  end
end
