module ApplicationHelper
  def error_messages_for(object)
    html = ''
    if object.errors.any?
      html += '<div class="error_messages">'
      html += '<h2>Form is invalid</h2>'
      html += '<ul>'
      object.errors.full_messages.each do |message|
        html += "<li>#{message}</li>"
      end
      html += '</ul>'
      html += '</div>'
    end
    html.html_safe
  end

  def jquery_mobile_theme
    'a'
  end

  def jquery_mobile_page(options = {})
    id = options[:id] || "#{controller.controller_name}-#{controller.action_name}"
    data = {:role => 'page', :theme => jquery_mobile_theme, :url => request.fullpath }.merge(options[:data] || {})
    classes = options[:classes] || Array(options[:class])
    capture_haml do
      haml_tag :div, :id => id, :class => classes.join(" ").presence, :data => data do
        yield
      end
    end
  end
end
