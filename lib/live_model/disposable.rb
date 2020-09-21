class LiveModel::Disposable
  def initialize
    @callbacks = []
    @disposed = false
  end

  def <<(callback)
    if disposed?
      raise "Cannot add callback to a disposed Disposable"
    end

    @callbacks << callback
    self
  end

  def disposed?
    @disposed
  end

  def dispose
    if !disposed?
      @callbacks.each do |cb| 
        case cb
        when Thread
          Thread.kill(cb)
        when LiveModel::Publisher::Listener
          cb.dispose
        else
          cb.call
        end
      end
    end
    @disposed = true
  end

  def join
    while !disposed? do
      # Throw if a thread has failed
      @callbacks
        .filter { |cb| cb.class == Thread }
        .filter { |thread| thread.status.nil? }
        .first
        &.join

      sleep 1
    end
  end
end