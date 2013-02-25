class Log < ActiveRecord::Base

  attr_accessible :severity, :error, :code, :exception, :stack

  class << self

    def info(error, exception = nil)
      log(error, 1, exception)
    end

    def error(error, exception = nil)
      log(error, 2, exception)
    end

    def fatal(error, exception = nil)
      log(error, 3, exception)
    end



    protected

    def log(error, severity, exception)
      message = nil; stack = nil
      unless exception.nil?
        message = exception.message
        stack = exception.backtrace.first(5).join("/n")
      end
      create(:severity => severity, :error => error, :exception => message, :stack => stack)
    end

  end

end
