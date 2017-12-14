
import numpy as np
from sklearn.mixture import GMM


class GMMC(object):
    
    def __init__(self, covariance='tied'):
        self.covar_type = covariance

    def fit(self, X_train, y_train):
        n_classes = len(np.unique(y_train))
        self.clf = GMM(n_components=n_classes, covariance_type=self.covar_type, init_params='wc', n_iter=20)
        self.clf.means_ = np.array([X_train[y_train == i].mean(axis=0) for i in range(n_classes)])
        self.clf.fit(X_train)

    def predict(self, X_test):
        return self.clf.predict(X_test)

    def predict_proba(self, X_test):
        return self.clf.predict_proba(X_test)

    def score(self, X_test, y_test):
        score_ = 0
        for i, x in enumerate(X_test):
            p = self.clf.predict_proba(X_test)
            pred_label = np.argmax(p)
            if (pred_label == y_test[i]):
                score_ += 1
        return score_/len(X_test)
