namespace Omnifest.Services
{
    public class ViewerCountService
    {
        private static int _viewers = 0;

        public int getViewers()
        {
            return _viewers;
        }

        public void setViewers(int viewers)
        {
            _viewers = viewers;
        }
    }
}