require 'securerandom'

class LiveModel::Publisher
  def initialize()
    @listeners = {}
  end

  def subscribe(&block)
    id = SecureRandom.uuid
    @listeners[id] = Listener.new(block, -> { @listeners.delete(id) })
  end

  def publish(message)
    @listeners
      .map { |_, listener| listener }
      .filter { |listener| !listener.disposed }
      .each { |listener| listener.receive(message) }
  end

  def dispose
    @listeners
      .map { |_, listener| listener }
      .filter { |listener| !listener.disposed }
      .each { |listener| listener.dispose }
  end

  class Listener
    attr_reader :disposed
    private
      attr_writer :disposed
    public

    def initialize(on_message, on_dispose)
      @on_message = on_message
      @on_dispose = on_dispose

      disposed = false
    end
  
    def receive(message)
      if disposed
        raise "Disposed listener cannot receive"
      end

      @on_message.call(message)
    end
  
    def dispose
      if !disposed
        @on_dispose.call
      end
      disposed = true
    end
  end
end