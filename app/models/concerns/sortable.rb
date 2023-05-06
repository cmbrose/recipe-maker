module Sortable
  extend ActiveSupport::Concern

  module ClassMethods
    def sort_on(sort_mode)
      key, ordering = sort_mode.split('-', 2)

      result = order(key.to_sym)
      result = result.reverse if ordering == "desc"

      result
    end
  end
end
